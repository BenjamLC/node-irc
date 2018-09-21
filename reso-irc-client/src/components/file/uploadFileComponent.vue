<template>
  <form @submit.prevent="sendFile" enctype="multipart/form-date">

    <div class="field">
      <div class="file is-boxed is-primary">
        <label class="file-label">
          <input multiple type="file" ref="files" @change="selectFile" class="file-input" />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              Choisir un fichier
            </span>
          </span>
        </label>
      </div>
    </div>

    <div class="field">
      <div v-for="(file, index) in files" :key="index" :class="`level ${file.invalidMessage && 'has-text-danger'}`">
        <div class="level-left">
          <div class="level-item">
            {{file.name}}
            <span v-if="file.invalidMessage">&nbsp;- {{file.invalidMessage}}</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <a @click.prevent="files.splice(index, 1);uploadFiles.splice(index, 1)" class="delete"></a>
          </div>
        </div>
      </div>
    </div>
    <div class="field">
      <button class="button is-info">Envoyer</button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: "UploadFile",
  data() {
    return {
      files: [],
      uploadFiles: [],
      message: "",
      error: false
    }
  },
  methods: {
    selectFile() {
      const files = this.$refs.files.files
      this.uploadFiles = [ ...this.uploadFiles, ...files]

      this.files = [
        ...this.files,
        ..._.map(files, file => ({
          name : file.name,
          size: file.size,
          type: file.type,
          invalidMessage: this.validate(file)
        }))
      ]
    },
    async sendFile() {
      const formData = new FormData()

      _.forEach(this.uploadFiles, file => {
        if (this.validate(file) === "") {
          formData.append('files', file);
        }
      })

      try {
        await axios.post('/upload', formData)
        this.message = "Envoi ok"
        this.files = []
        this.uploadFiles = []
      } catch(err){
        this.message = err.response.data.error
        this.error = true
      }
    },
    validate(file) {
      const MAX_SIZE = 3000000
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"]

      if (file.size > MAX_SIZE) {
        return  `Fichier trop volumineux. La taille maximum est de ${MAX_SIZE / 1000} KB`
      }

      if (!allowedTypes.includes(file.type)) {
        return "Images et PDF uniquement autorisés"
      }

      return ""
    }
  }
}
</script>
<style>
</style>