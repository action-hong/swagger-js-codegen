<script lang="ts" setup>
const modelValue = defineModel()
</script>

<template>
  <div flex="1" border="1px solid">
    <textarea v-model="modelValue" class="w-100% h-100% p-4" />
  </div>
</template>

<style lang="scss" scoped>

</style>
