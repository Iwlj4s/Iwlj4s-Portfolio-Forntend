<template>
  <nav class="projects-navbar">
    <div class="nav-items">
      <router-link 
        :to="isAuthenticated ? '/admin/profile' : '/public/profile'" 
        class="nav-item" 
        exact-active-class="active-link"
      >
        <span class="project-icon">›</span>
        <span class="project-name">Профиль</span>
      </router-link>
      <router-link 
        :to="isAuthenticated ? '/admin/projects' : '/projects'" 
        class="nav-item" 
        exact-active-class="active-link"
      >
        <span class="project-icon">›</span>
        <span class="project-name">Проекты</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const isAuthenticated = computed(() => {
  return !!localStorage.getItem('access_token')
})
</script>