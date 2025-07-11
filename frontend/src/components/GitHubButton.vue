<template>
    <button 
      @click="$emit('click')"
      class="github-btn"
    >
      <slot></slot>
    </button>
  </template>
  
  <style scoped>
  .github-btn {
    @apply bg-gray-900 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-gray-800 transition;
  }
  </style>