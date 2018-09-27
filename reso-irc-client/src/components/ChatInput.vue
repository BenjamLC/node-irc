<template>
    <div id="chat-input">
        <h2>Écrire</h2>
        <div id="input">
            <textarea rows="3" v-model="message" placeholder="Écrire un message dans le chat"></textarea>
            <button
                    v-on:click="onSendClick"
                    v-bind:disabled="isSendDisabled"
            >
                Envoyer
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ChatInput',
        props: [ 'socketConnected' ],
        data () {
            return {
                message: ''
            }
        },
        computed: {
            isSendDisabled () {
                return this.message === '' || !this.socketConnected
            }
        },
        methods: {
            onSendClick () {
                this.$emit('message', this.message);
                this.message = '';
            }
        }
    }
</script>

<style scoped lang="scss">
    #input {
        textarea {
            width: calc(100% - 6px);
        }
    }
</style>