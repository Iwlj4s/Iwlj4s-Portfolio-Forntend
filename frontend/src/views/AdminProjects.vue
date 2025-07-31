<template>
  <div class="projects-container">
    <div class="projects-header" style="display:flex; align-items:center; justify-content:flex-end; margin-bottom: 16px;">
      <button 
        class="update-projects-btn" 
        @click="updateAllProjects"
        :disabled="isUpdating"
      >
        <svg class="update-icon" :class="{ spin: isUpdating }" viewBox="0 0 24 24">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
        <span>{{ isUpdating ? 'Обновление...' : 'Обновить все' }}</span>
      </button>
    </div>

    <transition name="fade">
      <div v-if="isUpdating" class="update-notification">
        <div class="update-progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <p>
          Обновлено: {{ updatedProjectsCount }} из {{ totalProjectsCount }} проектов
          <span v-if="currentProject">({{ currentProject.owner_name }}/{{ currentProject.repo_name }})</span>
        </p>
      </div>
    </transition>

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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axiosInstance from '../axiosInstance.js'
import ProjectsCard from '../components/ProjectsCard.vue'
import AddProjectModal from '../components/AddProjectModal.vue'

const projects = ref([])
const isLoading = ref(false)
const isUpdating = ref(false)
const progress = ref(0)
const totalProjectsCount = ref(0)
const updatedProjectsCount = ref(0)
const currentProject = ref(null)
const taskId = ref(null)
const maxAttempts = ref(30) // Максимум 30 попыток (~1 минута)
const attempts = ref(0)
const checkInterval = ref(null)
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
  progress.value = 0
  updatedProjectsCount.value = 0
  totalProjectsCount.value = 0
  currentProject.value = null
  attempts.value = 0

  try {
    const response = await axiosInstance.post('/admin/projects/update')
    taskId.value = response.data.task_id
    startTaskStatusChecking()
  } catch (err) {
    console.error('Ошибка запуска обновления:', err)
    isUpdating.value = false
    alert(err.response?.data?.message || 'Ошибка запуска обновления')
  }
}

const startTaskStatusChecking = () => {
  checkInterval.value = setInterval(async () => {
    attempts.value++;
    
    try {
      const response = await axiosInstance.get(`/admin/tasks/${taskId.value}/status`);
      const taskStatus = response.data;
      
      if (attempts.value >= maxAttempts.value) {
        finishTaskStatusChecking();
        isUpdating.value = false;
        alert('Превышено время ожидания обновления');
        loadProjects(); // Загружаем проекты даже при таймауте
        return;
      }
      
      switch (taskStatus.status) {
        case 'NOT_FOUND':
          finishTaskStatusChecking();
          isUpdating.value = false;
          loadProjects(); // Обновляем список
          break;
          
        case 'PROGRESS':
          progress.value = Math.floor((taskStatus.result.current / taskStatus.result.total) * 100);
          updatedProjectsCount.value = taskStatus.result.updated || 0;
          totalProjectsCount.value = taskStatus.result.total || 0;
          currentProject.value = taskStatus.result.current_project || null;
          break;
          
        case 'SUCCESS':
          finishTaskStatusChecking();
          progress.value = 100;
          updatedProjectsCount.value = taskStatus.result.updated || totalProjectsCount.value;
          totalProjectsCount.value = taskStatus.result.total || totalProjectsCount.value;
          isUpdating.value = false;
          loadProjects(); // Важно: обновляем список после успеха
          break;
          
        case 'FAILURE':
          finishTaskStatusChecking();
          isUpdating.value = false;
          loadProjects(); // Обновляем список даже при ошибке
          alert('Ошибка при обновлении: ' + (taskStatus.result || 'Неизвестная ошибка'));
          break;
      }
    } catch (err) {
      console.error('Ошибка проверки статуса:', err);
      if (err.response?.status === 404 || err.response?.status === 400) {
        finishTaskStatusChecking();
        isUpdating.value = false;
        loadProjects(); // Обновляем список при ошибке
      }
    }
  }, 2000);
}

const finishTaskStatusChecking = () => {
  if (checkInterval.value) {
    clearInterval(checkInterval.value)
    checkInterval.value = null
  }
}

onBeforeUnmount(finishTaskStatusChecking)

onMounted(loadProjects)
</script>
