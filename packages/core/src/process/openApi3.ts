import type { OpenAPIV3 } from 'openapi-types'
import type { ProcessApiInfo, ProcessOpenAPIOptions, ProcessOpenAPIResult } from '../types'

export function processOpenAPI3(doc: OpenAPIV3.Document, _options: ProcessOpenAPIOptions = {}): ProcessOpenAPIResult {
  return {
    code: generateApiCode(doc, _options),
    dts: generateTSTypeCode(doc),
  }
}

interface Parameter {
  [key: string]: any
}

function generateApiCode(doc: OpenAPIV3.Document, option: ProcessOpenAPIOptions) {
  const result
    = Object.entries(doc.paths)
      .flatMap(([path, m]) => {
        if (!m) {
          return []
        }
        return Object.entries(m)
          .map(([method, obj]) => {
            const t = obj as any
            const info: ProcessApiInfo = {
              summary: t.summary,
              requestType: getRequestParmas(method, t),
              returnType: getSchemaType(t.responses[200]?.content?.['*/*']?.schema),
              method,
              url: path,
              functionName: getAPIName(path),
            }
            if (option.renderCode) {
              return option.renderCode(info)
            }
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
  return result.join('\n')
}

function getAPIName(path: string) {
  // 去掉后缀名和斜杠, 驼峰法合起来
  return path.replace(/\..*$/, '')
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
