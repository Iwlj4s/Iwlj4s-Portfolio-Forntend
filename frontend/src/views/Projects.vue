<template>
  <div class="projects-container">
    <div v-if="isLoading" class="loading">Загрузка проектов...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <ProjectsCard
      v-else
      :projects="projects"
      :is-admin="false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProjectsCard from '../components/ProjectsCard.vue'

const projects = ref([])
const isLoading = ref(false)
const error = ref(null)

const loadProjects = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await axios.get('http://localhost:8000/public/projects')
    projects.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка загрузки проектов'
    console.error('Error loading projects:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadProjects)
</script>

