<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content bordered-box">
      <h2 class="section-title">Добавить новый проект</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="repo-name">Название репозитория</label>
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
            Отмена
          </button>
          <button type="submit" class="button-common submit-btn">
            Добавить
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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #b6d1cb;
  font-weight: 500;
}

.input-field {
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #e0e0e0;
  font-family: 'JetBrains Mono', monospace;
}

.input-field:focus {
  outline: none;
  border-color: #1e7f5e;
  box-shadow: 0 0 0 2px rgba(30, 127, 94, 0.3);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #333;
  color: #b6d1cb;
}

.cancel-btn:hover {
  background-color: #444;
}

.submit-btn {
  background-color: #1e7f5e;
  color: #e8f0ee;
}

.submit-btn:hover {
  background-color: #2c974b;
}
</style>