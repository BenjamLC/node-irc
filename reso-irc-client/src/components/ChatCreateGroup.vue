<template>
    <div id="chat-create-group">
        <button
                v-on:click="displayCreateForm = true"
                v-if="!displayCreateForm"
        >
            Create
        </button>
        <select
                multiple="multiple"
                v-model="selectedNicknames"
                v-if="displayCreateForm"
        >
            <option
                    v-for="(nickname, key) in availableNicknames"
                    v-bind:key="key"
                    v-bind:value="nickname"
            >
                {{ nickname }}
            </option>
        </select><br/>
        <button
                v-on:click="displayCreateForm = false"
                v-if="displayCreateForm"
        >
            Dismiss
        </button>
        <button
                v-on:click="createGroup"
                v-if="displayCreateForm"
        >
            Send
        </button>
    </div>
</template>

<script>
    export default {
        name: "ChatCreateGroup",
        data () {
            return {
                displayCreateForm: false,
                selectedNicknames: [],
            }
        },
        props: [ 'availableNicknames' ],
        methods: {
            createGroup () {
                let selectedNicknames = this.selectedNicknames;
                this.$emit('create-group', selectedNicknames);

                this.selectedNicknames = [];
                this.displayCreateForm = false;
            }
        }
    }
</script>