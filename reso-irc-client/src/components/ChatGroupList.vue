<template>
    <div id="chat-group-list">
        <h2>Groups</h2>
        <chat-create-group
                v-on:create-group="onCreateGroup"
                :names="names"
        />
        <chat-group
                v-on:click-group="onClickGroup"
                v-for="(group, key) in groups"
                v-bind:key="key"
                v-bind:name="group.name"
                v-bind:channel="group.channel"
        />
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
        methods: {
            onClickGroup: function (conversation) {
                this.$emit('click-group', conversation);
            },
            onCreateGroup: function (name, users) {
                this.$emit('create-group', name, users);
            }
        },
        props: [ 'groups', 'names' ]
    }
</script>

<style scoped>

</style>