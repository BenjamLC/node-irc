const express = require('express');
const app = express();

server = app.listen(3001, function(){
    console.log('server listening on port 3001');
});

/*
 * IRC
 *
 * This server is set to be between an irc server (ngircd for example) and a front using a socket.
 *
 * There is two main functionality:
 * - Private message, use irc private messages
 * - Group message, create a channel #[uuid] with mode s (secret) and i (invite only) in which will be invited
 *   all users required by the group creator
 */
const config = require('./config');
const io = require('socket.io')(server);
const irc = require('irc');
const uuid = require('uuid/v1');

/* BOTS */
const UserListBot = require('./bots/UserListBot');
UserListBot(irc, config, io);


let clients = [];

io.on('connection', function (socket) {
    let client;

    socket.on('CONNECT', function (nickname) {
        client = new irc.Client(config.irc.server, nickname, {
            autoConnect: false
        });

        client.groups = [];
        clients.push(client);

        client.addListener('error', function (message) {
            console.log('error: ', message)
        });

        client.addListener('pm', function (from, message) {
            socket.emit('PM', {
                from: from,
                message: message
            });
        });

        client.addListener('invite', function (channel, from) {
            let admin = clients.find(client => client.nick === from);
            let group = admin.groups.find(group => group.channel === channel);

            client.groups.push({
                id: group.id,
                name: group.name,
                users: group.users,
                channel: group.channel
            });

            client.join(channel, () => {
                client.addListener('message' + group.channel, function (from, message) {
                    socket.emit('GM', {
                        id: group.id,
                        from: from,
                        message: message
                    });
                });

                socket.emit('GROUP_CREATED', {
                    id: group.id,
                    name: group.name
                });
            });
        });

        client.connect(() => {
            socket.emit('CONNECTED');
        });
    });

    socket.on('PM', function (data) {
        if (client) {
            client.say(data.to, data.message);
        }
    });

    socket.on('GM', function (data) {
        if (client) {
            let group = client.groups.find(group => group.id === data.to);

            client.say(group.channel, data.message);
        }
    });

    socket.on('CREATE_GROUP', function (data) {
        if (client) {
            let group = {
                id: uuid(),
                name: data.users.join(', '),
                users: data.users
            };

            group.channel = '#' + group.id;

            client.join(group.channel, () => {
                client.send('MODE', group.channel, 'i');
                client.send('MODE', group.channel, 's');

                group.users.forEach(user => {
                    if (user !== client.nick) {
                        client.send('INVITE', user, group.channel);
                    }
                });

                client.groups.push(group);

                client.addListener('message' + group.channel, function (from, message) {
                    socket.emit('GM', {
                        id: group.id,
                        from: from,
                        message: message
                    });
                });

                socket.emit('GROUP_CREATED', {
                    id: group.id,
                    name: group.name
                });
            });
        }
    });

    socket.on('disconnect', function () {
        if (client) {
            client.disconnect(() => {
                clients.splice(clients.indexOf(client), 1);
            });
        }
    });
});