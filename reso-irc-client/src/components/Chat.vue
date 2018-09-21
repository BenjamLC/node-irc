<template>
    <div id="chat">
        <h1>Chat</h1>
        <div id="left">
            <chat-user-list :users="users"/>
        </div>
        <div id="right">
            <chat-messages-container :messages="messages"/>
            <chat-input v-on:say="onSay" :socketConnected="socketConnected" :nickname="nickname"/>
        </div>
        socketConnected = {{ socketConnected }}
    </div>
</template>

<script>
    import ChatMessagesContainer from './ChatMessagesContainer'
    import ChatInput from './ChatInput'
    import ChatUserList from './ChatUserList'
    import Io from 'socket.io-client'

    export default {
        name: 'Chat',
        components: {
            ChatMessagesContainer,
            ChatInput,
            ChatUserList
        },
        data () {
            return {
                nickname: '',
                messages: [],
                users: [],
                socket: Io('localhost:3001'),
                socketConnected: false
            }
        },
        methods: {
            onSay: function (content) {
                if (this.socketConnected) {
                    this.socket.emit('SAY', content)
                }
            }
        },
        mounted () {
            this.nickname = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
            this.socket.on('GET_NICKNAME', () => {
                console.log(this.nickname);
                this.socket.emit('NICKNAME', this.nickname);
            });
            this.socket.on('CONNECTED', () => {
                this.socketConnected = true;
            });
            this.socket.on('MESSAGE', (data) => {
                this.messages.push(data);
            });
            this.socket.on('USER_LIST_UPDATE', (data) => {
                console.log(data);
                this.users = data;
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