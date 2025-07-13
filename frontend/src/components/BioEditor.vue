<template>
  <div class="bio-editor-container">
    <div class="quill-wrapper">
      <QuillEditor
        ref="quillEditor"
        v-model:content="content"
        contentType="html"
        :options="editorOptions"
        class="bio-editor"
        @update:content="handleContentUpdate"
      />
    </div>
    <div class="editor-actions">
      <button @click="save" class="button-common save-button">Сохранить</button>
      <button @click="cancel" class="button-common cancel-button">Отмена</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const content = ref(props.modelValue)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  if (newVal !== content.value) {
    content.value = newVal
  }
})

const handleContentUpdate = (newContent) => {
  emit('update:modelValue', newContent)
}

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'align': [] }], // Добавляем выпадающий список для выравнивания
      [{ color: [] }],
      ['link', 'image', 'video'],
      ['code-block'],
      ['clean']
    ]
  }
}

const save = () => {
  emit('save')
}

const cancel = () => {
  emit('cancel')
}
</script>