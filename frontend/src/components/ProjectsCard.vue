<template>
    <div class="navbar">
      <Navbar :is-admin="isAdmin" />
  </div>
  <div class="projects-grid">
    <div v-for="project in projects" :key="project.id" class="project-card">
      <div class="project-title-wrapper">
        <h3 class="project-title">{{ project.owner_name }}/{{ project.repo_name }}</h3>
        <h3 class="project-subtitle">Updated at - {{ formatDate(project.repo_updated_at) }}</h3>

        <a 
          :href="`https://github.com/${project.owner_name}/${project.repo_name}`" 
          target="_blank"
          class="project-github-link"
        >
          <svg class="project-github-icon" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span class="github-text">GitHub link</span>
        </a>
        
      </div>
      
      <div class="project-description">
        {{ project.description }}
      </div>
      
      <div class="readme-container">
        <div v-if="project.full_readme" class="project-readme" v-html="renderMarkdown(project.full_readme)"></div>
      </div>
      
      <div v-if="isAdmin" class="project-actions">
        <slot name="admin-content" :project="project"></slot>
      </div>
    </div>
    
    <div 
      v-if="isAdmin" 
      class="project-card add-project-card" 
      @click="$emit('add-project')"
    >
      <span>+ Добавить проект</span>
    </div>
  </div>
</template>


<script setup>
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Navbar from './Navbar.vue'


const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add-project'])

const formatDate = (dateString) => {
  if (!dateString) return 'Дата неизвестна'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}


const renderMarkdown = (markdown) => {
  const html = marked(markdown || '')
  const processedHtml = html.replace(/<img/g, '<img style="max-width:500px;height:auto"')
  return DOMPurify.sanitize(processedHtml)
}
</script>