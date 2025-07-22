<template>
    <nav class="projects-navbar">
      <div class="nav-items">
        <router-link to="/public/profile" class="nav-item" exact-active-class="active-link">
          <span class="project-icon">›</span>
          <span class="project-name">Профиль</span>
        </router-link>
        <router-link to="/projects" class="nav-item" exact-active-class="active-link">
          <span class="project-icon">›</span>
          <span class="project-name">Проекты</span>
        </router-link>
      </div>
    </nav>
  </template>
  
  <script setup>
  defineProps({
    isAdmin: {
      type: Boolean,
      default: false
    }
  })
  </script>

  