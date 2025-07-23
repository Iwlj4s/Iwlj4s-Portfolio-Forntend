<template>
  <div class="projects-container">
    <div class="projects-header" style="display:flex; align-items:center; justify-content:flex-end; margin-bottom: 16px;">
      <button 
        class="logout-btn update-projects-btn" 
        @click="updateAllProjects"
        :disabled="isUpdating"
        title="Обновить все проекты"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="logout-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            :class="{ spin: isUpdating }"
        >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h5M20 20v-5h-5M5 13a7 7 0 0114-2.5" />
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
