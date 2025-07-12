<template>
  <ProfileCard
    :userGithubData="userGithubData"
    :userData="userData"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard.vue';
import '../assets/main.css';
import '../assets/base.css';

const userGithubData = ref({});
const userData = ref({});
const projects = ref([]);

const loadData = async () => {
  try {
    const response = await axios.get('http://localhost:8000/public/profile');
    console.log('Public profile response:', response.data);
    
    userGithubData.value = response.data.user_github_data || {};
    userData.value = response.data.user_data || {};
    
    console.log('Github data:', userGithubData.value);
    console.log('User data:', userData.value);
    console.log('Projects:', projects.value);
  } catch (error) {
    console.error('Error loading public profile:', error);
  }
};

onMounted(loadData);
</script>
