import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { processOpenAPI } from '../src/index'

describe('codegen', () => {
  it('should return code and dts', () => {
    const swagger = JSON.parse(fs.readFileSync('./example/spec.json', 'utf-8'))
    const result = processOpenAPI(
      swagger,
    )
    expect(result.code).toMatchSnapshot()
    expect(result.dts).toMatchSnapshot()
  })
})
