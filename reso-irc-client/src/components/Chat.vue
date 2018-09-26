<template>
    <div id="chat">
        <h1>Chat as {{ nickname }}</h1>
        <div id="left">
            <chat-user-list v-on:click-user="selectChannel" :users="privateChannels" :currentChannel="currentChannel"/>
            <chat-group-list v-on:click-group="selectChannel" v-on:create-group="onCreateGroup" :groups="groupChannels" :names="names" :current-channel="currentChannel"/>
        </div>
        <div id="right" v-if="currentChannel">
            <chat-messages-container :messages="currentChannelObject.messages" :currentChannel="currentChannel"/>
            <chat-input v-on:say="onSay" :socketConnected="socketConnected"/>
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
                currentChannel: '',
                channels: [],
                socket: Io('localhost:3001'),
                socketConnected: false
            }
        },
        computed: {
            currentChannelObject: function () {
                return this.channels.find(channel => channel.name === this.currentChannel)
            },
            privateChannels: function () {
                return this.channels.filter(channel => channel.type === 'private');
            },
            groupChannels: function () {
                return this.channels.filter(channel => channel.type === 'group');
            },
            names: function () {
                return this.privateChannels.map(channel => channel.name);
            }
        },
        methods: {
            onSay: function (content) {
                if (this.socketConnected) {
                    if (this.currentChannelObject.type === 'private') {
                        this.socket.emit('PM', {
                            to: this.currentChannel,
                            message: content
                        });
                    } else if (this.currentChannelObject.type === 'group') {
                        this.socket.emit('GM', {
                            to: this.currentChannel,
                            message: content
                        });
                    }
                    this.addMessage(this.currentChannel, this.nickname, content);
                }
            },
            selectChannel: function (name) {
                this.currentChannel = name;
            },
            addMessage: function (name, author, content) {
                this.channels.find(channel => channel.name === name).messages.push({
                    author: author,
                    content: content
                });
            },
            onCreateGroup: function (users) {
                users.push(this.nickname);
                this.socket.emit('CREATE_GROUP', {
                    'users': users
                });
            }
        },
        mounted () {
            this.nickname = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
            this.socket.emit('CONNECT', this.nickname);
            this.socket.on('CONNECTED', () => {
                this.socketConnected = true;
            });
            this.socket.on('USER_LIST_UPDATE', (data) => {
                if (this.socketConnected) {
                    let groupChannels = this.groupChannels;
                    data = data.filter(user => user.nickname !== this.nickname);
                    this.channels = data.map(user => {
                        let channel = this.channels.find(channel => channel.name === user.nickname);
                        if (!(channel)) {
                            return {
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
            this.socket.on('PM', (data) => {
                this.addMessage(data.from, data.from, data.message);
            });
            this.socket.on('GROUP_CREATED', (data) => {
                this.channels.push({
                    name: data,
                    type: 'group',
                    messages: []
                });
            });
            this.socket.on('GM', (data) => {
                this.addMessage(data.name, data.from, data.message);
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