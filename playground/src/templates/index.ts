const modules = import.meta.glob('./*.hbs', { as: 'raw', eager: true })

export const templates = Object.entries(modules).map(([path, template]) => {
  const name = path.replace('./', '').replace('.hbs', '')
  return { name, template }
})
