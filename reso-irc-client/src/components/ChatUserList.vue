<template>
    <div id="chat-user-list">
        <h2>Users</h2>
        <chat-user
                v-on:click-user="onClickUser"
                v-for="(userChannel, key) in privateChannels"
                v-bind:key="key"
                v-bind:userChannel="userChannel"
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
        props: [ 'privateChannels', 'currentChannel' ],
        methods: {
            onClickUser (channelId) {
                this.$emit('click-user', channelId);
            }
        }
    }
</script>