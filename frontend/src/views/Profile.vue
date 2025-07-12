<template>
  <div class="profile-card">
    <div class="profile-header">
      <img :src="userGithubData.avatar_url" class="profile-avatar">
      
      <div class="profile-info">
        <h1 class="profile-name">{{ userGithubData.github_login }} || {{ userGithubData.name }}</h1>
        
        <div v-if="isAdmin" class="admin-badge">
          ⚙️ Вы авторизованы
        </div>
        
        
      </div>

      <div class="github-data">
        <h2 class="section-title">User Info</h2>
        <h4 class="info-section-title">User Data</h4>
        <pre class="code-block">{{ JSON.stringify(userData, null, 2) }}</pre>      
        <h4 class="info-section-title">Github Data</h4>
        <pre class="code-block">{{ JSON.stringify(userGithubData, null, 2) }}</pre>
        
        <div v-if="isAdmin" class="admin-actions">
          <button @click="editProfile" class="edit-button">
            Редактировать профиль
          </button>
        </div>
      </div>
    </div>

    <div class="projects-section">
      <h2 class="section-title">Projects</h2>
      <div 
        v-for="project in projects" 
        :key="project.id" 
        class="project-item"
      >
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
        
        <!-- Кнопка удаления только для админа -->
        <button 
          v-if="isAdmin" 
          @click="deleteProject(project.id)" 
          class="delete-button"
        >
          Удалить
        </button>
      </div>
      
      <!-- Форма добавления только для админа -->
      <div v-if="isAdmin" class="add-project-form">
        <h3>Добавить новый проект</h3>
        <input v-model="newProject.name" placeholder="Название">
        <textarea v-model="newProject.description" placeholder="Описание"></textarea>
        <button @click="addProject">Добавить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const userGithubData = ref({});
const userData = ref({});
const projects = ref([]);
const isAdmin = ref(false);
const newProject = ref({ name: '', description: '' });

const testProjects = ref([
  { id: 1, name: 'Portfolio Backend', description: 'FastAPI + Vue.js' },
  { id: 2, name: 'Pet Project', description: 'Telegram Bot' }
]);

const isAuthenticated = ref(false);

const loadData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/admin/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    console.log('Admin profile response:', response.data);
    userGithubData.value = response.data.user_github_data;
    userData.value = response.data.user_data;
    projects.value = testProjects.value; 
    isAdmin.value = true;
    isAuthenticated.value = true;
  } catch (error) {
    try {
      const publicResponse = await axios.get('http://localhost:8000/public/profile');
      console.log('Public profile response:', publicResponse.data);
      userGithubData.value = publicResponse.data.user_github_data;
      userData.value = publicResponse.data.user_data;
      projects.value = testProjects.value;
      isAdmin.value = false;
      isAuthenticated.value = false;
    } catch (publicError) {
      console.error('Error loading public profile:', publicError);
    }
  }
};

const editProfile = () => {
  console.log('Editing profile...');
};

const deleteProject = (id) => {
  console.log('Deleting project:', id);
  projects.value = projects.value.filter(project => project.id !== id);
};

const addProject = () => {
  if (newProject.value.name && newProject.value.description) {
    projects.value.push({
      id: Date.now(),
      ...newProject.value
    });
    newProject.value = { name: '', description: '' };
  }
};

onMounted(loadData);
</script>

<style scoped>
/* Ваши стили остаются без изменений */
.admin-badge {
  display: inline-block;
  background: rgba(100, 255, 218, 0.2);
  color: #b6d1cb;;
  padding: 5px 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 0.9em;
}

.admin-actions {
  margin-top: 20px;
}

.edit-button {
  background: #b6d1cb;;
  color: #000;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.delete-button {
  background: #ff5555;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  margin-top: 10px;
  cursor: pointer;
}

.add-project-form {
  margin-top: 30px;
  padding: 20px;
  background: rgba(16, 16, 16, 0.5);
  border-radius: 8px;
}

.add-project-form input,
.add-project-form textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  background: #111;
  border: 1px solid #333;
  color: white;
}
</style>