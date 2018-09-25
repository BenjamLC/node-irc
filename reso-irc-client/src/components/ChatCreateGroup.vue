<template>
    <div id="chat-create-group">
        <button v-on:click="displayCreateForm = true" v-if="!displayCreateForm">Create</button>
        <input placeholder="Group name" type="text" v-model="groupName" v-if="displayCreateForm"/>
        <select multiple="multiple" v-model="selectedUsers" v-if="displayCreateForm">
            <option v-for="name in names" :value="name">{{ name }}</option>
        </select><br/>
        <button v-on:click="displayCreateForm = false" v-if="displayCreateForm">Dismiss</button>
        <button v-on:click="createGroup" v-if="displayCreateForm">Send</button>
    </div>
</template>

<script>
    export default {
        name: "ChatCreateGroup",
        data() {
            return {
                displayCreateForm: false,
                selectedUsers: [],
                groupName: ''
            }
        },
        props: [ 'names' ],
        methods: {
            createGroup: function () {
                this.$emit('create-group', this.groupName, this.selectedUsers);

                this.selectedUsers = [];
                this.groupName = '';
                this.displayCreateForm = false;
            }
        }
    }
</script>

<style scoped>

</style>