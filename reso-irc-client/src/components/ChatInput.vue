<template>
  <div id="chat-input">
    <h2>Écrire - {{ nickname }}</h2>
    <div id="input">
      <upload-file v-model="file"></upload-file>
      <textarea rows="3" v-model="content" placeholder="Écrire un message dans le chat"></textarea>
      <button v-on:click="onSendClick" v-bind:disabled="isSendDisabled">
        Envoyer
      </button>
    </div>
  </div>
</template>

<script>
import uploadFile from './file/uploadFileComponent'

    export default {
        name: 'ChatInput',
        props: [ 'socketConnected', 'nickname' ],
        data() {
            return {
                content: '',
  file:''
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
        },
        components: {uploadFile}
    }
</script>

<style scoped lang="scss">
#input {
  textarea {
    width: calc(100% - 6px);
  }
}
</style>