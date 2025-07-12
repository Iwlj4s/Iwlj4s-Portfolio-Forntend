<template>
  <div class="bio-editor-container">
    <div class="quill-wrapper">
      <QuillEditor
        :content="modelValue"
        @update:content="updateValue"
        :options="editorOptions"
        class="bio-editor"
      />
    </div>
    <div class="editor-actions">
      <button @click="save" class="save-button">Сохранить</button>
      <button @click="cancel" class="cancel-button">Отмена</button>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean']
    ]
  }
}

const updateValue = (value) => {
  emit('update:modelValue', value)
}

const save = () => {
  emit('save')
}

const cancel = () => {
  emit('cancel')
}
</script>

