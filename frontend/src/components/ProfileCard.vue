<template>
  <div class="profile-card">
    <div class="profile-header">
      <img :src="userGithubData.avatar_url" class="profile-avatar">
      
      <div class="profile-info">
        <h1 class="profile-name">{{ userGithubData.github_login }} || {{ userGithubData.name }}</h1>
      </div>

      <div class="github-data">
        <h2 class="section-title">User Info</h2>
        <h3 class="info-section-title">User Data</h3>
        <pre class="code-block">{{ JSON.stringify(userData, null, 2) }}</pre>        
        <h3 class="info-section-title">Github Data</h3>
        <pre class="code-block">{{ JSON.stringify(userGithubData, null, 2) }}</pre>
        
      </div>

    </div>
    <div class="projects-section">
        <h2 class="section-title">About Me</h2>
        <div v-if="userBio" v-html="userBio"></div>
        <div v-else>Информации нет</div>
        
        <div >
          <BioEditor
            v-if="isAdmin && isEditing"
            :modelValue="editableBio"
            @update:modelValue="editableBio = $event"
            @save="handleSave"
            @cancel="handleCancel"
          />
        </div>
        <slot name="admin-content"></slot>
      </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import BioEditor from './BioEditor.vue'

const props = defineProps({
  userGithubData: {
    type: Object,
    default: () => ({})
  },
  userData: {
    type: Object,
    default: () => ({})
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  userBio: {
    type: String
  }
})

const emit = defineEmits(['update:bio', 'toggle-edit'])

const editableBio = ref(props.userBio || '')
watch(() => props.userBio, (newBio) => {
  editableBio.value = newBio || ''
})

function handleSave() {
  emit('update:bio', editableBio.value)
  emit('toggle-edit')
}

function handleCancel() {
  editableBio.value = props.userBio || ''
  emit('toggle-edit')
}
</script>
