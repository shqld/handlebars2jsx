import camelcase from 'camelcase'

import Base from './base'
import { JSValue } from './jsom'

export class JSXNode extends Base {
  // toString() {
  //   if (!typeof this.value === 'string') {
  //     new Error(`Not valid JSXNode: ${this}`)
  //   }
  //   return this.value
  // }
}

export type JSXElementProps = {
  children?: Array<JSXNode>
}

export class JSXElement extends JSXNode {
  children: Array<JSXNode>

  constructor(props: JSXElementProps) {
    super(props)

    this.children = props.children || []
  }

  toString() {
    return this.children.join('')
  }
}

export type JSXComponentProps = {
  name: string
  props?: Array<{ key: string; value: JSXExpression }>
  chunkProps?: Array<string>
  children?: Array<JSXNode>
  fileName: string
}

export class JSXComponent extends JSXElement {
  name: string
  props: Array<{ key: string; value: JSXExpression }>
  chunkProps: Array<string>
  fileName: string

  constructor(props: JSXComponentProps) {
    super(props)

    // @ts-ignore
    this.name = camelcase(props.name, { pascalCase: true })
    this.props = props.props || []
    this.chunkProps = props.chunkProps || []
    this.fileName = props.fileName
  }

  toString() {
    const chunkProps = this.chunkProps.map(chunk => `{...${chunk}}`).join(' ')
    const props = this.props.map(prop => `${prop.key}=${prop.value}`).join(' ')

    return `<${this.name} ${chunkProps} ${props}>`
  }
}

export type JSXTextProps = {
  values: string | Array<string>
}

export class JSXText extends JSXNode {
  values: string | Array<string>

  constructor(props: JSXTextProps) {
    super(props)

    this.values = props.values
  }

  toString() {
    if (typeof this.values === 'string') {
      return this.values
    }

    return this.values.join('')
  }
}

export type JSXExpressionProps = {
  value: JSValue | string
}

export class JSXExpression extends Base {
  value: JSValue | string

  constructor(props: JSXExpressionProps) {
    super(props)

    this.value = props.value
  }

  toString() {
    return `{${this.value}}`
  }
}

export class JSXComment extends Base {
  value?: string

  constructor(props?: { value?: string }) {
    super(props || {})

    this.value = props && props.value
  }

  toString() {
    if (this.value) {
      return this.value
    }

    return ''
  }
}
