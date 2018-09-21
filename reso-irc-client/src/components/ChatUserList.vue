<template>
    <div id="chat-user-list">
        <h2>Users</h2>
        <chat-user
                v-for="user in users"
                v-bind:nickname="user.nickname"
        />
    </div>
</template>

<script>
    import ChatUser from './ChatUser'

    export default {
        name: "ChatUserList",
        components: {
            ChatUser
        },
        props: [ 'users' ]
    }
</script>

<style scoped>

</style>