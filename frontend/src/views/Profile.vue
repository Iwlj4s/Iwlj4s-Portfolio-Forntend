<template>
  <div class="profile-container">
    <ProfileCard
      :user-github-data="userGithubData"
      :user-data="userData"
      :projects="projects"
    >
      <!-- Слот для админских элементов внутри карточки -->
      <template v-if="isAdmin" #admin-content>
        <div class="admin-actions">
          <button @click="editProfile" class="edit-button">
            Редактировать профиль
          </button>
        </div>
      </template>
    </ProfileCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard.vue';

const userGithubData = ref({});
const userData = ref({});
const projects = ref([]);
const isAdmin = ref(false);

const loadData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/admin/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    userGithubData.value = response.data.user_github_data;
    userData.value = response.data.user_data;
    projects.value = response.data.projects || [];
    isAdmin.value = true;
  } catch (error) {
    try {
      const publicResponse = await axios.get('http://localhost:8000/public/profile');
      userGithubData.value = publicResponse.data.user_github_data;
      userData.value = publicResponse.data.user_data;
      projects.value = publicResponse.data.projects || [];
      isAdmin.value = false;
    } catch (publicError) {
      console.error('Error loading profile:', publicError);
    }
  }
};

const editProfile = () => {
  console.log('Editing profile...');
};

onMounted(loadData);
</script>