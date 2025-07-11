import axios from 'axios'

<template>
  <div class="profile-card">
    <div class="profile-header">
      <img :src="userData.avatar_url" class="profile-avatar">
      
      <div class="profile-info">
        <h1 class="profile-name">{{ userData.github_login}} || {{ userData.name }}</h1>
        <span class="status-badge">Online</span>
        <div class="bio" v-if="userData.bio">
          {{ userData.bio }}
        </div>
      </div>

      <div class="github-data">
        <h2 class="section-title">GitHub Data</h2>
        <pre class="code-block">{{ JSON.stringify(userData, null, 2) }}</pre>
      </div>
    </div>

    <div class="projects-section">
      <h2 class="section-title">Projects</h2>
      <div 
        v-for="project in testProjects" 
        :key="project.id" 
        class="project-item"
      >
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const userData = ref({});
  const testProjects = ref([
    { id: 1, name: 'Portfolio Backend', description: 'FastAPI + Vue.js' },
    { id: 2, name: 'Pet Project', description: 'Telegram Bot' }
  ]);
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:8000/admin/me/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      userData.value = response.data;
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  });
  </script>