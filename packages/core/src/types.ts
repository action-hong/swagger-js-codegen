export interface ProcessOpenAPIResult {
  /**
   * js 代码
   */
  code: string
  /**
   * ts格式代码
   */
  dts: string

  /**
   * jsdoc 类型标注
   */
  jsdoc: string
}

export interface ProcessApiInfo {
  method: string
  requestType: string
  returnType: string
  summary: string
  url: string
  functionName: string
}

export interface ProcessOpenAPIOptions {

  /**
   * 自行渲染代码
   */
  renderCode?: (info: ProcessApiInfo) => string
}
