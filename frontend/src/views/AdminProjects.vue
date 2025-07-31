<template>
  <div class="projects-container">
    <div class="projects-header" style="display:flex; align-items:center; justify-content:flex-end; margin-bottom: 16px;">
      <button 
        class="logout-btn update-projects-btn" 
        @click="updateAllProjects"
        :disabled="isUpdating"
        title="Обновить все проекты"
        >
       <svg class="update-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>

    </button>
    </div>

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
const isUpdating = ref(false)
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

const updateAllProjects = async () => {
  if (isUpdating.value) return
  isUpdating.value = true
  try {
    await axiosInstance.post('/admin/projects/update')
    // После успешного обновления заново загрузим проекты
    await loadProjects()
    alert('Все проекты успешно обновлены')
  } catch (err) {
    console.error('Ошибка обновления проектов:', err)
    alert(err.response?.data?.message || 'Ошибка обновления проектов')
  } finally {
    isUpdating.value = false
  }
}

onMounted(loadProjects)
</script>
