<template>
    <div id="chat-messages-container">
        <h2>Messages to {{ currentChannel }}</h2>
        <div ref="messagesContainer" id="messages">
            <chat-message
                    v-for="(message, key) in messages"
                    :key="key"
                    v-bind:author="message.author"
                    v-bind:content="message.content"
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
        props: [ 'messages', 'currentChannel' ],
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