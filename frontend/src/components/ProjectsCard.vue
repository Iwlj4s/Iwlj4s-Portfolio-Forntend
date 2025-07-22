<template>
  <div class="projects-card">
    <div class="projects-header">
      <h1 class="projects-title">Проекты</h1>
      <button
        v-if="isAdmin"
        @click="$emit('add-project')"
        class="button-common add-project-btn"
        title="Добавить проект"
      >
        + Добавить
      </button>
    </div>

    <div v-if="projects.length" class="projects-list grid-container">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-item bordered-box"
      >
        <div class="project-name-box section-title bordered-box">
          {{ project.name }}
        </div>

        <div class="project-description-wrapper">
          <p
            class="project-description"
            v-html="shortDescription(project.id)"
          ></p>
          <button
            v-if="isDescriptionLong(project.id)"
            @click="toggleDescription(project.id)"
            class="button-common toggle-desc-btn"
          >
            {{ isExpanded(project.id) ? 'Свернуть' : 'Показать больше' }}
          </button>
        </div>

        <a
          v-if="project.link"
          :href="project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="project-link"
        >
          Перейти к проекту
        </a>

        <div v-if="isAdmin" class="admin-actions">
          <slot name="admin-content" :project="project"></slot>
        </div>
      </div>
    </div>

    <div v-else class="no-projects">Проектов пока нет.</div>

    <div class="navbar">
      <Navbar :is-admin="isAdmin" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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

const emit = defineEmits(['add-project'])

const expandedProjects = ref({})

function isExpanded(id) {
  return !!expandedProjects.value[id]
}

function toggleDescription(id) {
  expandedProjects.value[id] = !expandedProjects.value[id]
}

function isDescriptionLong(id) {
  const project = props.projects.find(p => p.id === id)
  if (!project || !project.description) return false
  return project.description.length > 300
}

function shortDescription(id) {
  const project = props.projects.find(p => p.id === id)
  if (!project || !project.description) return 'Описание отсутствует'
  if (isExpanded(id)) return project.description
  if (project.description.length > 300) {
    return project.description.slice(0, 300) + '...'
  }
  return project.description
}
</script>
