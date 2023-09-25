<script lang="ts" setup>
import { processOpenAPI } from 'clscg-core'

// @ts-expect-error missing types
import { Pane, Splitpanes } from 'splitpanes'
import Mustache from 'mustache'
import raw from './constants/demo.json?raw'
import 'splitpanes/dist/splitpanes.css'
import { allTemlates } from '~/data'

const code = ref(raw)

const templateKey = ref(0)

const result = computed(() => {
  try {
    return processOpenAPI(JSON.parse(code.value), {
      renderCode: (info) => {
        return Mustache.render(allTemlates.value[templateKey.value].template, {
          ...info,
          isPost: info.method.toLowerCase() === 'post',
          isGet: info.method.toLowerCase() === 'get',
        })
      },
    })
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
        <Splitpanes
          horizontal
        >
          <Pane>
            <Editor
              v-model="code" :control="false"
              title="swagger doc"
            />
          </Pane>
          <Pane>
            <CustomTemplate />
          </Pane>
        </Splitpanes>
      </Pane>
      <Pane>
        <Editor
          :model-value="result.code"
          language="javascript"
          title="api代码"
          readonly
        >
          <select
            v-model="templateKey"
            class="mx-2"
          >
            <option
              v-for="(template, index) in allTemlates"
              :key="index"
              :value="index"
            >
              {{ template.name }}
            </option>
          </select>
        </Editor>
      </Pane>
      <Pane>
        <Editor
          :model-value="result.dts"
          language="typescript"
          title="ts类型文件"
          readonly
        />
      </Pane>
    </Splitpanes>
  </main>
</template>

<style lang="scss" scoped>
</style>
