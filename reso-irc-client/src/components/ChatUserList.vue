<template>
    <div id="chat-user-list">
        <h2>Users</h2>
        <chat-user
                v-on:click-user="onClickUser"
                v-for="(user, key) in users"
                v-bind:key="key"
                v-bind:name="user.name"
                v-bind:messages="user.messages"
                v-bind:currentChannel="currentChannel"
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
        methods: {
            onClickUser: function (conversation) {
                this.$emit('click-user', conversation);
            }
        },
        props: [ 'users', 'currentChannel' ]
    }
</script>

<style scoped>

</style>