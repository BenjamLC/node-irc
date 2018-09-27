<template>
    <div id="chat-group">
        <a href="#" v-on:click.prevent="$emit('click-group', groupChannel.id)">
            <strong v-if="newMessage">(*) </strong><strong>{{ groupChannel.name }}</strong>
        </a>
    </div>
</template>

<script>
    export default {
        name: "ChatGroup",
        data () {
            return {
                newMessage: false
            }
        },
        props: [ 'groupChannel', 'currentChannel' ],
        computed: {
            messages () {
                return this.groupChannel.messages
            },
            currentChannelId () {
                if (this.currentChannel) {
                    return this.currentChannel.id
                }
            }
        },
        watch: {
            messages () {
                if (this.currentChannelId !== this.groupChannel.id) {
                    this.newMessage = true;
                }
            },
            currentChannelId () {
                if (this.currentChannelId === this.groupChannel.id) {
                    this.newMessage = false;
                }
            }
        }
    }
</script>