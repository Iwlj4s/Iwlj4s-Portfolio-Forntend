<template>
  <div class="profile-container">
    <ProfileCard
      :user-github-data="userGithubData"
      :user-data="userData"
      :user-bio="userBio"
      :is-admin="isAdmin"
      :is-editing="isEditing"
      @update:bio="updateBio"
      @toggle-edit="toggleEdit"
    >
      <!-- Слот для админских элементов внутри карточки -->
      <template v-if="isAdmin && !isEditing" #admin-content>
        <div class="admin-actions">
          <button @click="toggleEdit" class="edit-button">Изменить</button>
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
const isAdmin = ref(false);
const isEditing = ref(false)

const userBio = ref()

const loadData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/admin/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    userGithubData.value = response.data.user_github_data;
    userData.value = response.data.user_data;
    userBio.value = response.data.user_bio
    isAdmin.value = true;
  } catch (error) {
    try {
      const publicResponse = await axios.get('http://localhost:8000/public/profile');
      userGithubData.value = publicResponse.data.user_github_data;
      userData.value = publicResponse.data.user_data;
      userBio.value = publicResponse.data.user_bio
      isAdmin.value = false;
    } catch (publicError) {
      console.error('Error loading profile:', publicError);
    }
  }
};

const toggleEdit = () => {
  isEditing.value = !isEditing.value
  console.log('Editing bio')
}

// Новая функция для обновления био на сервере
const updateBio = async (newBio) => {
  try {
    const response = await axios.patch('http://localhost:8000/admin/change_bio', 
      { bio: newBio }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }
    )
    console.log('Bio updated:', response.data)
    // Обновляем локальные данные
    userBio.value = newBio
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update bio:', error)
    // Можно уведомить пользователя об ошибке
  }
}


onMounted(loadData);
</script>

