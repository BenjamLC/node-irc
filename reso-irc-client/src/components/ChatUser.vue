<template>
    <div id="chat-user">
        <a href="#" v-on:click.prevent="$emit('click-user', userChannel.id)">
            <strong v-if="newMessage">(*) </strong><strong>{{ userChannel.name }}</strong>
        </a>
    </div>
</template>

<script>
    export default {
        name: "ChatUser",
        data () {
            return {
                newMessage: false
            }
        },
        props: [ 'userChannel', 'currentChannel' ],
        computed: {
            messages () {
                return this.userChannel.messages;
            },
            currentChannelId () {
                if (this.currentChannel) {
                    return this.currentChannel.id;
                }
            }
        },
        watch: {
            messages () {
                if (this.currentChannelId !== this.userChannel.id) {
                    this.newMessage = true;
                }
            },
            currentChannelId () {
                if (this.currentChannelId === this.userChannel.id) {
                    this.newMessage = false;
                }
            }
        }
    }
</script>