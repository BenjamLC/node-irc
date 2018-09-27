<template>
    <div id="chat-message">
        <strong>{{ from }}</strong><br/>
        <p>{{ message }}</p>
    </div>
</template>

<script>
    export default {
        name: "ChatMessage",
        props: [ 'from', 'message' ]
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