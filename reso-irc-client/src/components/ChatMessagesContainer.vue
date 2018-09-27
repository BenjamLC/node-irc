<template>
    <div id="chat-messages-container">
        <h2>Messages to {{ currentChannel.name }}</h2>
        <div ref="messagesContainer" id="messages">
            <chat-message
                    v-for="(message, key) in currentChannel.messages"
                    v-bind:key="key"
                    v-bind:from="message.from"
                    v-bind:message="message.message"
            />
        </div>
    </div>
</template>

<script>
    import ChatMessage from './ChatMessage'

    export default {
        name: 'ChatMessagesContainer',
        components: {
            ChatMessage
        },
        props: [ 'currentChannel' ],
        updated () {
            let messagesContainer = this.$refs.messagesContainer;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
</script>

<style scoped lang="scss">
    #messages {
        display: flex;
        flex-direction: column;
        overflow: auto;
        height: 190px;
        border: 1px solid black;
    }
</style>