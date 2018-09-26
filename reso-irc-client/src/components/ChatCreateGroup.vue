<template>
    <div id="chat-create-group">
        <button v-on:click="displayCreateForm = true" v-if="!displayCreateForm">Create</button>
        <select multiple="multiple" v-model="selectedUsers" v-if="displayCreateForm">
            <option v-for="(name, key) in names" :key="key" :value="name">{{ name }}</option>
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
            }
        },
        props: [ 'names' ],
        methods: {
            createGroup: function () {
                let selectedUsers = this.selectedUsers;
                this.$emit('create-group', selectedUsers);

                this.selectedUsers = [];
                this.displayCreateForm = false;
            }
        }
    }
</script>

<style scoped>

</style>