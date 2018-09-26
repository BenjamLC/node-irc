const express = require('express');
const app = express();

server = app.listen(3001, function(){
    console.log('server listening on port 3001');
});

const io = require('socket.io')(server);
const irc = require('irc');
const uuid = require('uuid/v1');

let ircConf = {
    server: 'chat.freenode.net',
    globalChannel: '#conserto-reso-test'
};

let clients = [];

io.on('connection', function (socket) {
    let client;

    socket.on('CONNECT', function (nickname) {
        client = new irc.Client(ircConf.server, nickname, {
            autoConnect: false
        });

        client.nickname = nickname;
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
            let admin = clients.find(client => client.nickname === from);
            let group = admin.groups.find(group => group.channel === channel);

            client.groups.push({
                name: group.name,
                users: group.users,
                channel: group.channel
            });

            client.join(channel, () => {
                client.addListener('message' + group.channel, function (from, message) {
                    socket.emit('GM', {
                        name: group.name,
                        from: from,
                        message: message
                    });
                });

                socket.emit('GROUP_CREATED', group.name);
            });
        });

        client.connect(() => {
            // TODO: remove when stop using freenode server
            client.send('MODE', nickname, '-R');
            client.join(ircConf.globalChannel, () => {
                socket.emit('CONNECTED');
            });
        });
    });

    socket.on('PM', function (data) {
        if (client) {
            client.say(data.to, data.message);
        }
    });

    socket.on('GM', function (data) {
        if (client) {
            let group = client.groups.find(group => group.name === data.to);

            client.say(group.channel, data.message);
        }
    });

    socket.on('CREATE_GROUP', function (data) {
        if (client) {
            let group = {
                name: data.users.join(', '),
                users: data.users,
                channel: '#' + uuid()
            };

            client.join(group.channel, () => {
                client.send('MODE', group.channel, 'i');

                group.users.forEach(user => {
                    if (user !== client.nickname) {
                        client.send('INVITE', user, group.channel, group.name);
                    }
                });

                client.groups.push(group);

                client.addListener('message' + group.channel, function (from, message) {
                    socket.emit('GM', {
                        name: group.name,
                        from: from,
                        message: message
                    });
                });

                console.log(group.name);
                console.log(group.channel);
                socket.emit('GROUP_CREATED', group.name);
            });
        }
    });

    socket.on('disconnect', function () {
        client.part(ircConf.globalChannel, () => {
            client.disconnect();
        });
        clients.splice(clients.indexOf(client), 1);
    });
});

let watchClient = new irc.Client(ircConf.server, 'bot_watch', {
    autoConnect: false
});

watchClient.addListener('error', function (message) {
    console.log('error: ', message)
});

watchClient.connect(() => {
    watchClient.join(ircConf.globalChannel, () => {
        watchClient.addListener('names' + ircConf.globalChannel, (nicknames) => {
            let users = [];

            for (let nickname in nicknames) {
                if (nicknames.hasOwnProperty(nickname) && !nickname.startsWith('bot_watch')) {
                    users.push({ nickname: nickname });
                }
            }

            io.emit("USER_LIST_UPDATE", users);
        });

        watchClient.addListener('join' + ircConf.globalChannel, () => {
            watchClient.send('NAMES', ircConf.globalChannel);
        });

        watchClient.addListener('part' + ircConf.globalChannel, () => {
            watchClient.send('NAMES', ircConf.globalChannel);
        });

        watchClient.addListener('kick' + ircConf.globalChannel, () => {
            watchClient.send('NAMES', ircConf.globalChannel);
        });

        watchClient.addListener('kill', () => {
            watchClient.send('NAMES', ircConf.globalChannel);
        });

        watchClient.addListener('quit', () => {
            watchClient.send('NAMES', ircConf.globalChannel);
        });
    });
});