<script lang="ts" setup>
import { processOpenAPI } from '@clscg/core'

const code = ref('')

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
</script>

<template>
  <main
    flex="~" font-sans p="x-4 y-10" text="center gray-700 dark:gray-200"
    gap="4"
  >
    <Editor v-model="code" />
    <Editor v-model="result.code" />
  </main>
</template>

<style lang="scss" scoped>

</style>
