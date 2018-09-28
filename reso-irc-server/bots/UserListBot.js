/*
 * This bot is used to list all users connected to the server given in config.irc.server
 *
 * Send the client a "CLIENT_LIST_UPDATE" message containing all users nicknames
 *
 * This bot use the "WHO" command which return connected users one by one (multiple messages)
 */
const UserListBot = function (irc, config, io) {
    let bot = new irc.Client(config.irc.server, 'user_list_bot', {
        autoConnect: false
    });

    bot.addListener('error', function (message) {
        console.log('error: ', message)
    });

    bot.connect(() => {
        let clients = [];

        bot.addListener('raw', message => {
            switch (message.command) {
                case 'rpl_whoreply':
                    let nickname = message.args[5];
                    if (!nickname.endsWith('_bot')) {
                        clients.push({
                            nickname: nickname
                        });
                    }
                    break;
                case 'rpl_endofwho':
                    io.emit("CLIENT_LIST_UPDATE", clients);
                    clients = [];
                    break;
            }
        });

        function getUserList() {
            bot.send('WHO');

            setTimeout(getUserList, 10000);
        }

        getUserList();
    });
};

module.exports = UserListBot;