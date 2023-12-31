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

watch(() => modelValue.value, () => {
  if (editor && modelValue.value !== editor.getValue()) {
    editor.setValue(modelValue.value || '')
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
    tabSize: 2,
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

function clear() {
  if (editor) {
    editor.setValue('')
    modelValue.value = ''
  }
}
</script>

<template>
  <div>
    <div class="h-60px flex items-center font-bold px-2">
      <h2 class="text-lg">
        {{ title }}
      </h2>
      <slot />
      <div class="ml-auto flex items-center gap-2">
        <div v-if="!readonly" class="i-carbon-trash-can icon-btn" title="删除代码" @click="clear" />
        <div class="i-carbon-copy icon-btn" title="复制代码" @click="copy()" />
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
