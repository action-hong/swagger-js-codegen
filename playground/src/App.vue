<script lang="ts" setup>
import { processOpenAPI } from 'clscg-core'

// @ts-expect-error missing types
import { Pane, Splitpanes } from 'splitpanes'
import Mustache from 'mustache'
import raw from './constants/demo.json?raw'
import 'splitpanes/dist/splitpanes.css'
import { allTemlates } from '~/data'

const code = ref(raw)

const formData = useLocalStorage('__swagger_codegen_config', {
  templateKey: 0,
  jsdoc: false,
})

const result = computed(() => {
  try {
    return processOpenAPI(JSON.parse(code.value), {
      renderCode: (info) => {
        return Mustache.render(allTemlates.value[formData.value.templateKey].template, {
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
      jsdoc: '',
    }
  }
})

const showCode = computed(() => {
  if (formData.value.jsdoc) {
    return result.value.jsdoc + result.value.code
  }
  return result.value.code
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
          :model-value="showCode"
          language="javascript"
          title="api代码"
          readonly
        >
          <select
            v-model="formData.templateKey"
            class="mx-2"
          >
            <option
              v-for="(template, index) in allTemlates"
              :key="index"
              :class="{
                'color-teal-500': template.internal,
              }"
              :value="index"
            >
              {{ template.name }}
            </option>
          </select>
          <input v-model="formData.jsdoc" type="checkbox" name="jsdoc">
          <label for="jsdoc">jsdoc</label>
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
