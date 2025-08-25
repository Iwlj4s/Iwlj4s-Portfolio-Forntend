<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Portfolio Admin</h1>
      <button @click="loginWithGitHub" class="github-button">
        <svg class="github-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/>
        </svg>
        <span class="button-text">Войти через GitHub</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const loginWithGitHub = () => {
  const authWindow = window.open(
    'http://localhost:8000/auth/github',
    'githubAuth',
    'width=600,height=700'
  )

  // Обработчик сообщений
  const handleMessage = (event) => {
    // Важно проверять origin!
    if (event.origin !== 'http://localhost:5173') return
    
    if (event.data.type === 'github-auth-success') {
      localStorage.setItem('access_token', event.data.token)
      localStorage.setItem('user', JSON.stringify(event.data.user))
      router.push('/admin/profile')
    }
    else if (event.data.type === 'github-auth-error') {
      alert(`Ошибка авторизации: ${event.data.error}`)
    }
  }

  window.addEventListener('message', handleMessage)

  // Удаляем обработчик через 5 минут
  setTimeout(() => {
    window.removeEventListener('message', handleMessage)
  }, 300000)
}

</script>