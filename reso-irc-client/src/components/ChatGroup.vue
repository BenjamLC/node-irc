<template>
    <div id="chat-group">
        <a href="#" v-on:click.prevent="$emit('click-group', name)"><strong v-if="newMessage">(*) </strong><strong>{{ name }}</strong></a>
    </div>
</template>

<script>
    export default {
        name: "ChatGroup",
        data() {
            return {
                newMessage: false
            }
        },
        props: [ 'name', 'messages', 'currentChannel' ],
        watch: {
            messages: function () {
                if (this.currentChannel !== this.name) {
                    this.newMessage = true;
                }
            },
            currentChannel: function () {
                if (this.currentChannel === this.name) {
                    this.newMessage = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>