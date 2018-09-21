<template>
    <div id="chat-message">
        <strong>{{ author }}</strong><br/>
        <p>{{ content }}</p>
    </div>
</template>

<script>
    export default {
        name: "ChatMessage",
        props: [ 'author', 'content' ]
    }
</script>

<style scoped lang="scss">
    #chat-message:first-child {
        margin-top: auto;
    }
    strong {
        margin-left: 5px;
    }
    p {
        margin-left: 25px;
    }
</style>