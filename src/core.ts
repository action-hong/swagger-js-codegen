interface CodegenOptions {
  swagger: any
}

// todo:
interface Parameter {
  [key: string]: any
}

export function codegen(
  options: CodegenOptions,
) {
  const {
    swagger,
  } = options

  const code = generateApiCode(swagger)
  const type = generateTSTypeCode(swagger)

  return {
    code,
    type,
  }
}

function generateApiCode(swagger: any) {
  const result
    = Object.entries(swagger.paths)
      .flatMap(([path, m]) => {
        return Object.entries(m as any)
          .map(([method, obj]) => {
            const t = obj as any
            const data = method === 'get' ? 'params' : 'data'
            return `
/**
 * ${t.summary}
 * @param {${getRequestParmas(method, t)}} ${data}
 * @param {import('axios').AxiosRequestConfig} config
 * @returns {Promise<${getSchemaType(t.responses[200]?.content?.['*/*']?.schema)}>}
 */
export const ${getAPIName(path)} = (${data}, config = {}) => {
  return request.request({
    method: '${method}',
    url: '${path}',
    ${data},
    ...config
  })
}       
          
`
          })
      })

  return result.join('')
}

function getAPIName(path: string) {
  // 去掉后缀名和斜杠, 驼峰法合起来
  return path.replace(/\.json/, '')
    .slice(1)
    .replace(/[\/_](\w)/g, (_, $1) => $1.toUpperCase())
}

function getRequestParmas(method: string, meta: any) {
  if (method === 'get' || meta.parameters) {
    const params = meta.parameters as Parameter[] || []
    const types = params.map((p) => {
      const name = p.name
      let type = 'string'
      if (p.schema?.$ref) {
        type = getSchemaType(p.schema)
      }
      else {
        type = p.schema?.type ?? 'string'
        type = getMapType(type)
      }
      return `${name}${p.required ? '' : '?'}: ${type}`
    })
    return `{ ${types.join(', ')} }`
  }
  else if (method === 'post') {
    return getSchemaType(meta.requestBody?.content['application/json']?.schema)
  }
  return 'any'
}

function getSchemaType(schema: any) {
  let type = 'any'
  if (!schema) {
    return 'unknown'
  }

  if (schema.$ref) {
    const ref = schema.$ref as string
    type = ref.split('/').pop() as string
  }
  else if (schema.type) {
    type = getMapType(schema.type)
    if (type === 'array') {
      type = `Array<${getSchemaType(schema.items)}>`
    }
  }
  return type
}

const MAP_TYPE: Record<string, string> = {
  integer: 'number',
}

function getMapType(type: string) {
  if (type in MAP_TYPE) {
    return MAP_TYPE[type]
  }

  return type
}

function generateTSTypeCode(swagger: any) {
  const schemas = swagger.components.schemas
  return Object.entries(schemas)
    .map(([name, schema]) => {
      const s = schema as any
      const required = s.required || []
      return `
interface ${name} {
${
  Object.entries(s.properties)
    .map(([key, value]) => {
      const v = value as any
      const isRequired = required.includes(key)
      const type = getSchemaType(v)
      return `  ${key}${isRequired ? '' : '?'}: ${type}`
    }).join(',\n')
}
}      
`
    }).join('')
}
