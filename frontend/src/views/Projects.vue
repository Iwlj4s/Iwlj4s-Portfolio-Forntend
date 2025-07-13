<template>
    <div class="projects-page">
      <Navbar :is-admin="isAdmin" :projects="projects"/>
      
      <div class="project-content">
        <h2 class="section-title">{{ selectedProject?.name || 'Select project' }}</h2>
        <div v-if="selectedProject">
          <p>{{ selectedProject.description }}</p>
          <div class="tech-stack">
            <span v-for="tech in selectedProject.tech" :key="tech" class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </div>
        <div v-else>
          <p>Select a project from the navbar to view details</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Navbar from '../components/Navbar.vue'
  
  const isAdmin = ref(true) // В реальном коде берем из props/store
  const selectedProject = ref(null)
  
  const projects = ref([
    // ... тестовые данные ...
  ])
  </script>
  
  <style scoped>
  .projects-page {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 40px;
    max-width: 1200px;
    margin: 50px auto;
    padding: 30px;
  }
  
  .project-content {
    background: #111;
    padding: 30px;
    border: 1px solid #b6d1cb;
  }
  
  .tech-stack {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .tech-tag {
    background: #1e7f5e;
    color: #b6d1cb;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
  }
  </style>