<script setup lang="ts">
import { computed, ref } from 'vue'
import { customTemplates } from '~/store'

const templateKey = ref(0)
const name = ref(customTemplates.value[templateKey.value]?.name ?? '')
const code = ref(customTemplates.value[templateKey.value]?.template ?? '')

const isEdit = computed(() => !!name.value)

function save() {
  // check hbs

  // 弹窗
  if (!isEdit.value) {
    // eslint-disable-next-line no-alert
    const name = prompt('输入模板名称')
    if (!name) {
      // eslint-disable-next-line no-alert
      alert('请输入模板名称')
      return
    }
    if (customTemplates.value.find(item => item.name === name)) {
      // eslint-disable-next-line no-alert
      alert('模板名称重复')
      return
    }

    customTemplates.value.push({
      name,
      template: code.value,
    })
    templateKey.value = customTemplates.value.length - 1
  }
  else {
    customTemplates.value[templateKey.value] = {
      name: name.value,
      template: code.value,
    }
  }
}

function createNew() {
  name.value = ''
  code.value = ''
  templateKey.value = -1
}

function selectTemplate(e: Event) {
  const index = Number((e.target as HTMLSelectElement).value)
  templateKey.value = index
  name.value = customTemplates.value[index]?.name ?? ''
  code.value = customTemplates.value[index]?.template ?? ''
}

function deleteCurrent() {
  if (templateKey.value === -1) {
    return
  }

  customTemplates.value.splice(templateKey.value, 1)
  createNew()
}
</script>

<template>
  <Editor
    v-model="code"
    language="text"
    title="自定义模板"
  >
    <select
      v-show="customTemplates.length > 0"
      :value="templateKey"
      class="mx-2"
      @change="selectTemplate"
    >
      <option
        v-for="(template, index) in customTemplates"
        :key="index"
        :value="index"
      >
        {{ template.name }}
      </option>
    </select>
    <div class="icon-btn mx-1 i-carbon-add-alt" title="新建空白模板" @click="createNew" />
    <div class="icon-btn mx-1 i-carbon-save" title="保存" :disabled="code" @click="save" />
    <div class="icon-btn mx-1 i-carbon-task-remove" title="删除模板" @click="deleteCurrent" />
  </Editor>
</template>
