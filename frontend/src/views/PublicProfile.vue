<template>
    <div class="profile-card">
      <div class="profile-header">
        <img :src="userData.avatar_url" class="profile-avatar">
        
        <div class="profile-info">
            <h1 class="profile-name">{{ userData.github_login }} || {{ userData.name }}</h1>
          
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
          v-for="project in projects" 
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
  const projects = ref([
    { id: 1, name: 'Portfolio Backend', description: 'FastAPI + Vue.js' },
    { id: 2, name: 'Pet Project', description: 'Telegram Bot' }
  ]);
  
  const loadData = async () => {
    try {
      const publicResponse = await axios.get('http://localhost:8000/public/profile');
      userData.value = publicResponse.data.user;
    } catch (publicError) {
      console.error('Error loading public profile:', publicError);
    }
  };
  
  onMounted(loadData);
  </script>
  
  <style scoped>
  .profile-card {
    max-width: 1200px;
    margin: 40px auto;
    padding: 30px;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 40px;
  }
  
  .profile-avatar {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border: 3px solid #444;
    box-shadow: 0 0 15px rgba(100, 255, 218, 0.3);
  }
  
  .profile-name {
    font-size: 2rem;
    font-weight: 700;
    color: #64ffda;
    margin-bottom: 10px;
  }
  
  .code-block {
    background: #111;
    padding: 20px;
    border-radius: 5px;
    font-size: 1rem;
    overflow-x: auto;
    white-space: pre-wrap;
    border: 1px solid #333;
  }
  
  .projects-section {
    background: #111;
    padding: 30px;
    border: 1px solid #333;
  }
  
  .project-item {
    padding: 20px;
    margin-bottom: 15px;
    background: #0a0a0a;
    border-left: 3px solid #64ffda;
  }
  
  .project-item h3 {
    color: #64ffda;
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  
  .project-item p {
    color: #aaa;
  }
  </style>