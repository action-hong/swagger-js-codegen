<script lang="ts" setup>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: 'json',
  },
  control: {
    type: Boolean,
    default: true,
  },
})
const modelValue = defineModel<string>()
const monacoEl = ref()
let editor: monaco.editor.IStandaloneCodeEditor

watchEffect(() => {
  if (modelValue.value && editor && props.control) {
    editor.setValue(modelValue.value)
  }
})

onMounted(() => {
  editor = monaco.editor.create(monacoEl.value, {
    value: modelValue.value,
    language: props.language,
    theme: 'vs-dark',
    automaticLayout: true,
    readOnly: props.readonly,
    minimap: {
      enabled: false,
    },
  })

  const cancel = editor.onDidChangeModelContent(() => {
    modelValue.value = editor.getValue()
  })

  return () => {
    cancel.dispose()
    editor.dispose()
    editor = null as any
  }
})
</script>

<template>
  <div ref="monacoEl" />
</template>

<style scoped>
div {
  height: 100vh;
}
</style>
