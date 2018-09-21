<template>
    <div id="chat-user">
        <strong>{{ nickname }}</strong>
    </div>
</template>

<script>
    export default {
        name: "ChatUser",
        props: [ 'nickname' ]
    }
</script>

<style scoped>

</style>