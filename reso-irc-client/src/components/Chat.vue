<template>
    <div id="chat">
        <h1>Chat as {{ nickname }}</h1>
        <div id="left">
            <chat-user-list
                    v-on:click-user="selectChannel"
                    v-bind:privateChannels="privateChannels"
                    v-bind:currentChannel="currentChannel"
            ></chat-user-list>
            <chat-group-list
                    v-on:click-group="selectChannel"
                    v-on:create-group="onCreateGroup"
                    v-bind:groupChannels="groupChannels"
                    v-bind:current-channel="currentChannel"
                    v-bind:availableNicknames="availableNicknames"
            ></chat-group-list>
        </div>
        <div id="right" v-if="currentChannel">
            <chat-messages-container
                    v-bind:currentChannel="currentChannel"
            ></chat-messages-container>
            <chat-input
                    v-on:message="onMessage"
                    v-bind:socketConnected="socketConnected"
            ></chat-input>
        </div>
        socketConnected = {{ socketConnected }}
    </div>
</template>

<script>
    import ChatMessagesContainer from './ChatMessagesContainer'
    import ChatInput from './ChatInput'
    import ChatUserList from './ChatUserList'
    import ChatGroupList from './ChatGroupList'
    import Io from 'socket.io-client'

    export default {
        name: 'Chat',
        components: {
            ChatMessagesContainer,
            ChatInput,
            ChatUserList,
            ChatGroupList
        },
        data () {
            return {
                nickname: '',
                currentChannelId: '',
                channels: [],
                socket: Io('localhost:3001'),
                socketConnected: false
            }
        },
        computed: {
            currentChannel () {
                return this.channels.find(channel => channel.id === this.currentChannelId)
            },
            privateChannels () {
                return this.channels.filter(channel => channel.type === 'private');
            },
            groupChannels () {
                return this.channels.filter(channel => channel.type === 'group');
            },
            availableNicknames () {
                return this.privateChannels.map(channel => channel.name);
            }
        },
        methods: {
            onMessage (message) {
                if (this.socketConnected) {
                    switch (this.currentChannel.type) {
                        case 'private':
                            this.socket.emit('PM', {
                                to: this.currentChannelId,
                                message: message
                            });
                            this.addMessage(this.currentChannelId, this.nickname, message);
                            break;
                        case 'group':
                            this.socket.emit('GM', {
                                to: this.currentChannelId,
                                message: message
                            });
                            this.addMessage(this.currentChannelId, this.nickname, message);
                            break;
                    }
                }
            },
            selectChannel (channelId) {
                this.currentChannelId = channelId;
            },
            addMessage (id, author, content) {
                this.channels.find(channel => channel.id === id).messages.push({
                    from: author,
                    message: content
                });
            },
            onCreateGroup (users) {
                users.push(this.nickname);
                this.socket.emit('CREATE_GROUP', {
                    'users': users
                });
            }
        },
        mounted () {
            // TODO: remove random nickname
            this.nickname = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);

            // Ask the server for irc connection
            this.socket.emit('CONNECT', this.nickname);

            // When irc connection is done
            this.socket.on('CONNECTED', () => {
                this.socketConnected = true;
            });

            // When this client receive a private message
            this.socket.on('PM', (data) => {
                this.addMessage(data.from, data.from, data.message);
            });

            // When a group containing this client is created
            this.socket.on('GROUP_CREATED', (data) => {
                this.channels.push({
                    id: data.id,
                    name: data.name,
                    type: 'group',
                    messages: []
                });
            });

            // When this client receive a group message
            this.socket.on('GM', (data) => {
                this.addMessage(data.id, data.from, data.message);
            });

            // When the client list provided by the UserListBot is updated
            this.socket.on('CLIENT_LIST_UPDATE', (data) => {
                if (this.socketConnected) {
                    let groupChannels = this.groupChannels;
                    data = data.filter(user => user.nickname !== this.nickname);
                    this.channels = data.map(user => {
                        let channel = this.channels.find(channel => channel.id === user.nickname);
                        if (!(channel)) {
                            return {
                                id: user.nickname,
                                name: user.nickname,
                                type: 'private',
                                messages: []
                            };
                        } else {
                            return channel;
                        }
                    }).concat(groupChannels);
                }
            });
        }
    }
</script>

<style scoped lang="scss">
    #chat {
        width: 100%;
    }
    #left {
        width: 200px;
        float: left;
        padding: 0 15px;
    }
    #right {
        width: auto;
        overflow: hidden;
        padding: 0 15px;
    }
</style>