<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content bordered-box">
      <h2 class="section-title">Add project</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="repo-name">Repository name</label>
          <input
            id="repo-name"
            v-model="repositoryName"
            type="text"
            required
            placeholder="my-project"
            class="input-field"
          >
        </div>
        
        <div class="form-actions">
          <button type="button" class="button-common cancel-btn" @click="close">
            Cancel
          </button>
          <button type="submit" class="button-common submit-btn">
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'submit'])

const repositoryName = ref('')

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', {
    repository_name: repositoryName.value
  })
  repositoryName.value = ''
}
</script>