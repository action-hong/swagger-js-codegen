<script lang="ts" setup>
import { processOpenAPI } from '@clscg/core'
import { getHighlighter } from 'shikiji'
import raw from './constants/demo.json?raw'

let shiki: any
const code = ref(raw)

const jsHtml = ref('')
const result = computed(() => {
  try {
    return processOpenAPI(JSON.parse(code.value))
  }
  catch (error) {
    return {
      code: '',
    }
  }
})

getHighlighter({
  themes: ['nord'],
  langs: ['javascript'],
}).then((highlighter) => {
  shiki = highlighter
  jsHtml.value = shiki.codeToHtml(result.value.code, { lang: 'javascript', theme: 'nord' })
})

watch(() => result.value.code, (code) => {
  if (shiki) {
    jsHtml.value = shiki.codeToHtml(code, { lang: 'javascript', theme: 'nord' })
  }
})
</script>

<template>
  <main
    flex="~" font-sans p="x-4 y-10" gray-700 dark:gray-200
    gap="4"
  >
    <Editor v-model="code" />
    <div flex="1" class="h-100%" v-html="jsHtml" />
  </main>
</template>

<style lang="scss" scoped>

</style>
