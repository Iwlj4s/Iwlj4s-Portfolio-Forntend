<template>
  <div class="projects-container">
    <ProjectsCard
      :projects="projects"
      :is-admin="isAdmin"
      @add-project="onAddProject"
    >
      <template #admin-content="{ project }">
        <button class="button-common" @click="editProject(project)">Редактировать</button>
        <button class="button-common" @click="deleteProject(project)">Удалить</button>
      </template>
    </ProjectsCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProjectsCard from '../components/ProjectsCard.vue'

const isAdmin = ref(true) // для теста переключаем режим админа

const projects = ref([
  {
    id: 1,
    name: 'Iwlj4s/BookReviews',
    description: 'Описание первого проекта',
    link: 'https://github.com/Iwlj4s/BookReviews'
  },
  {
    id: 2,
    name: 'Проект 2',
    description: 'Описание второго проекта',
    link: ''
  }
])

function onAddProject() {
  alert('Добавление проекта (заглушка)')
}

function editProject(project) {
  alert(`Редактирование проекта: ${project.name} (заглушка)`)
}

function deleteProject(project) {
  alert(`Удаление проекта: ${project.name} (заглушка)`)
}
</script>

<style scoped>
.projects-container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
