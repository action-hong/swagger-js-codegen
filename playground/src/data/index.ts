import { customTemplates } from '~/store'
import { templates } from '~/templates'

export const allTemlates = computed(() => {
  return [
    ...templates.map(item => ({
      internal: true,
      ...item,
    })),
    ...customTemplates.value.map(item => ({
      internal: false,
      ...item,
    })),
  ]
})
