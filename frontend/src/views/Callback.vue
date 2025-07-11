<template>
  <div class="callback-container">
    <div v-if="success">
      <h3>Авторизация успешна!</h3>
      <p>Это окно можно закрыть</p>
      <button @click="closeWindow">Закрыть окно</button>
    </div>
    <div v-if="error" class="error">
      <h3>Ошибка авторизации</h3>
      <p>{{ error }}</p>
      <button @click="closeWindow">Закрыть окно</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const success = ref(false)
const error = ref(null)

const closeWindow = () => {
  window.close()
}

onMounted(async () => {
  try {
    const code = route.query.code
    if (!code) throw new Error('Отсутствует код авторизации')

    const { data } = await axios.get(`http://localhost:8000/auth/github/callback?code=${code}`)

    if (window.opener) {
      window.opener.postMessage({
        type: 'github-auth-success',
        token: data.access_token,
        user: data.user
      }, 'http://localhost:5173')
    }

    success.value = true

    // Автоматически закрыть окно через 1-2 секунды
    setTimeout(() => {
      window.close()
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.error || err.message
    if (window.opener) {
      window.opener.postMessage({
        type: 'github-auth-error',
        error: error.value
      }, 'http://localhost:5173')
    }
  }
})

</script>

<style scoped>
.callback-container {
  padding: 2rem;
  text-align: center;
  font-family: sans-serif;
}
.error {
  color: red;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>