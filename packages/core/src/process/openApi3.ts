import type { OpenAPIV3 } from 'openapi-types'
import type { ProcessOpenAPIOptions, ProcessOpenAPIResult } from '../types'

export function processOpenAPI3(doc: OpenAPIV3.Document, options: ProcessOpenAPIOptions = {}): ProcessOpenAPIResult {
  return {
    code: '',
    dts: '',
  }
}
