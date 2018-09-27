<template>
    <div id="chat-group-list">
        <h2>Groups</h2>
        <chat-create-group
                v-on:create-group="onCreateGroup"
                v-bind:availableNicknames="availableNicknames"
        ></chat-create-group>
        <chat-group
                v-on:click-group="onClickGroup"
                v-for="(groupChannel, key) in groupChannels"
                v-bind:key="key"
                v-bind:groupChannel="groupChannel"
                v-bind:currentChannel="currentChannel"
        ></chat-group>
    </div>
</template>

<script>
    import ChatGroup from './ChatGroup'
    import ChatCreateGroup from './ChatCreateGroup'

    export default {
        name: "ChatGroupList",
        components: {
            ChatGroup,
            ChatCreateGroup
        },
        props: [ 'groupChannels', 'currentChannel', 'availableNicknames' ],
        methods: {
            onCreateGroup (nicknames) {
                this.$emit('create-group', nicknames);
            },
            onClickGroup (channelId) {
                this.$emit('click-group', channelId);
            }
        }
    }
</script>