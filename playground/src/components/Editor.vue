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
  title: {
    type: String,
    default: '',
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

const { copy } = useClipboard({
  source: modelValue.value,
})
</script>

<template>
  <div>
    <div class="h-60px flex items-center font-bold px-2">
      <h2 class="text-lg">
        {{ title }}
      </h2>
      <div class="ml-auto">
        <div class="i-carbon-copy cursor-pointer opacity-75 hover:opacity-100" title="复制代码" @click="copy()" />
      </div>
    </div>
    <div ref="monacoEl" class="kk-editor" />
  </div>
</template>

<style scoped>
div.kk-editor {
  height: calc(100vh - 60px);
}
</style>
