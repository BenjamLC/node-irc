<template>
    <div id="chat">
        <h1>Chat</h1>
        <div id="left">
            <chat-user-list v-on:click-user="selectChannel" :users="privateChannels" :currentChannel="currentChannel"/>
            <chat-group-list v-on:click-group="selectChannel" v-on:create-group="onCreateGroup" :groups="groupChannels" :names="names"/>
        </div>
        <div id="right" v-if="currentChannel">
            <chat-messages-container :messages="currentChannelMessages"/>
            <chat-input v-on:say="onSay" :socketConnected="socketConnected" :nickname="nickname"/>
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
            currentChannelMessages: function () {
                return this.channels.find(channel => channel.name === this.currentChannel).messages;
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
                    this.socket.emit('PM', {
                        to: this.currentChannel,
                        message: content
                    });
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
            onCreateGroup: function (name, users) {
                console.log(name);
                console.log(users);
            }
        },
        mounted () {
            this.nickname = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
            this.socket.emit('CONNECT', this.nickname);
            this.socket.on('CONNECTED', () => {
                this.socketConnected = true;
            });
            this.socket.on('USER_LIST_UPDATE', (data) => {
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
                });
            });
            this.socket.on('PM', (data) => {
                this.addMessage(data.from, data.from, data.message);
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