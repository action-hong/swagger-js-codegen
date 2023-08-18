import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { codegen } from '../src/core'

describe('codegen', () => {
  it('should return code', () => {
    const swagger = JSON.parse(fs.readFileSync('./example/spec.json', 'utf-8'))
    const result = codegen({
      swagger,
    })
    expect(result.code).toMatchSnapshot()
    expect(result.type).toMatchSnapshot()
  })
})
