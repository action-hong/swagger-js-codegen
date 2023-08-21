import type { OpenAPI, OpenAPIV3, OpenAPIV3_1 } from 'openapi-types'
import type { ProcessOpenAPIOptions, ProcessOpenAPIResult } from './types'
import { processOpenAPI2, processOpenAPI3, processOpenAPI3_1 } from './process'

export function processOpenAPI(doc: OpenAPI.Document, options: ProcessOpenAPIOptions = {}): ProcessOpenAPIResult {
  if ('swagger' in doc) {
    return processOpenAPI2(doc, options)
  }
  else if (doc.openapi.startsWith('3.1')) {
    return processOpenAPI3_1(doc as OpenAPIV3_1.Document, options)
  }
  else if (doc.openapi.startsWith('3.0')) {
    return processOpenAPI3(doc as OpenAPIV3.Document, options)
  }

  throw new Error('Not support openapi version')
}
