<template>
    <div class="profile-card">
      <div class="profile-header">
        <img :src="userGithubData.avatar_url" class="profile-avatar">
        
        <div class="profile-info">
            <h1 class="profile-name">{{ userGithubData.github_login }} || {{ userGithubData.name }}</h1>
          
          <div class="bio" v-if="userData.bio">
            {{ userData.bio }}
          </div>
        </div>

        <div class="github-data">
          <h2 class="section-title">Contacts Data</h2>
          <pre class="code-block">{{ JSON.stringify(userData, null, 2) }}</pre>
        </div>
        
        <div class="github-data">
          <h2 class="section-title">User Info</h2>
          <h4 class="info-section-title">User Data</h4>
          <pre class="code-block">{{ JSON.stringify(userData, null, 2) }}</pre>      
          <h4 class="info-section-title">Github Data</h4>
          <pre class="code-block">{{ JSON.stringify(userGithubData, null, 2) }}</pre>
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
  
  const userGithubData = ref({});
  const userData = ref({});
  const projects = ref([
    { id: 1, name: 'Portfolio Backend', description: 'FastAPI + Vue.js' },
    { id: 2, name: 'Pet Project', description: 'Telegram Bot' }
  ]);
  
  const loadData = async () => {
    try {
      const publicResponse = await axios.get('http://localhost:8000/public/profile');

      console.log('Public profile response:', publicResponse.data);

      userGithubData.value = publicResponse.data.user_github_data;
      userData.value = publicResponse.data.user_data;

    } catch (publicError) {
      console.error('Error loading public profile:', publicError);
    }
  };
  
  onMounted(loadData);
  </script>
  
  