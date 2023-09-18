<script lang="ts" setup>
import { processOpenAPI } from '@clscg/core'

// @ts-expect-error missing types
import { Pane, Splitpanes } from 'splitpanes'
import raw from './constants/demo.json?raw'
import 'splitpanes/dist/splitpanes.css'

const code = ref(raw)

const result = computed(() => {
  try {
    return processOpenAPI(JSON.parse(code.value))
  }
  catch (error) {
    return {
      code: '',
      dts: '',
    }
  }
})
</script>

<template>
  <main
    flex="~" font-sans gray-700 dark:gray-200
    gap="4"
  >
    <Splitpanes class="default-theme h-100vh">
      <Pane>
        <Editor v-model="code" :control="false" />
      </Pane>
      <Pane>
        <Editor
          :model-value="result.code"
          language="javascript"
          readonly
        />
      </Pane>
      <Pane>
        <Editor
          :model-value="result.dts"
          language="typescript"
          readonly
        />
      </Pane>
    </Splitpanes>
  </main>
</template>

<style lang="scss" scoped>
</style>
