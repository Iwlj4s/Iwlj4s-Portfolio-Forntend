<template>
    <div class="profile-card">
      <div class="profile-header">
        <img :src="userGithubData.avatar_url" class="profile-avatar">
        
        <div class="profile-info">
          <h1 class="profile-name">{{ userGithubData.github_login }} || {{ userGithubData.name }}</h1>
          <div class="bio" v-if="userData.bio">{{ userData.bio }}</div>
        </div>
  
        <div class="github-data">
          <h2 class="section-title">User Info</h2>
          <h3 class="info-section-title">User Data</h3>
          <pre class="code-block">{{ JSON.stringify(userData, null, 2) }}</pre>        
          <h3 class="info-section-title">Github Data</h3>
          <pre class="code-block">{{ JSON.stringify(userGithubData, null, 2) }}</pre>
          
          <!-- Слот для админского контента -->
          <slot name="admin-content"></slot>
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
  defineProps({
    userGithubData: {
      type: Object,
      default: () => ({})
    },
    userData: {
      type: Object,
      default: () => ({})
    },
    projects: {
      type: Array,
      default: () => []
    }
  });
  </script>