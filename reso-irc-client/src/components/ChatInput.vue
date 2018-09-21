<template>
    <div id="chat-input">
        <h2>Écrire - {{ nickname }}</h2>
        <div id="input">
            <textarea rows="3" v-model="content" placeholder="Écrire un message dans le chat"></textarea>
            <button v-on:click="onSendClick" v-bind:disabled="isSendDisabled">
                Envoyer
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ChatInput',
        props: [ 'socketConnected', 'nickname' ],
        data() {
            return {
                content: ''
            }
        },
        computed: {
            isSendDisabled() {
                return this.content === '' || !this.socketConnected
            }
        },
        methods: {
            onSendClick () {
                this.$emit('say', this.content);
                this.content = '';
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