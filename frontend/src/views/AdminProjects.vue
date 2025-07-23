<template>
  <div class="projects-container">
    <div v-if="isLoading" class="loading">Загрузка проектов...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <ProjectsCard
        :projects="projects"
        :is-admin="true"
        @add-project="showAddProjectModal = true"
      >
        <template #admin-content="{ project }">
          <button @click="deleteProject(project.id)" class="button-common delete-btn">
            Удалить
          </button>
        </template>
      </ProjectsCard>
      
      <AddProjectModal
        v-if="showAddProjectModal"
        @close="showAddProjectModal = false"
        @submit="addProject"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '../axiosInstance.js'
import ProjectsCard from '../components/ProjectsCard.vue'
import AddProjectModal from '../components/AddProjectModal.vue'

const projects = ref([])
const isLoading = ref(false)
const error = ref(null)
const showAddProjectModal = ref(false)

const loadProjects = async () => {
  try {
    isLoading.value = true
    error.value = null
    const response = await axiosInstance.get('/admin/projects')
    projects.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка загрузки проектов'
    console.error('Error loading projects:', err)
  } finally {
    isLoading.value = false
  }
}

const addProject = async (projectData) => {
  try {
    await axiosInstance.post('/admin/projects/add', projectData)
    await loadProjects()
    showAddProjectModal.value = false
  } catch (err) {
    console.error('Error adding project:', err)
    error.value = err.response?.data?.message || 'Ошибка добавления проекта'
  }
}

const deleteProject = async (projectId) => {
  if (!confirm('Вы уверены, что хотите удалить этот проект?')) return
  
  try {
    await axiosInstance.delete(`/admin/projects/delete/${projectId}`)
    await loadProjects()
  } catch (err) {
    console.error('Error deleting project:', err)
    error.value = err.response?.data?.message || 'Ошибка удаления проекта'
  }
}

onMounted(loadProjects)
</script>
