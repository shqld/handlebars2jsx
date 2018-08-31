import Base from './base'
import { JSXExpression } from './jsxom'

export class JSValue extends Base {}

export class JSObject extends JSValue {}

export class JSXProp extends JSObject {}

export type JSTemplateProps = {
  values?: Array<JSXExpression>
}

export class JSTemplate extends JSValue {
  values: Array<JSXExpression>

  constructor(props: JSTemplateProps) {
    super(props)

    this.values = props.values || []
  }

  toString() {
    const values = this.values
      .map(v => {
        if (v instanceof JSString) {
          return v
        }

        // Escape
        return '$' + v.toString()
      })
      .join('')

    return `\`${values}\``
  }
}

export type JSFunctionProps = {
  name: string
  args?: Array<string>
  inline?: boolean
}

export class JSFunction extends JSValue {
  name: string
  args: Array<string>
  inline: boolean

  constructor(props: JSFunctionProps) {
    super(props)

    this.name = props.name
    this.args = props.args || []
    this.inline = props.inline || false
  }

  toString() {
    return `${this.name}(${this.args.join(', ')})`
  }
}

export class JSLiteral extends JSValue {}

export class JSString extends JSLiteral {
  value: string

  constructor(props: { value: string }) {
    super(props)

    this.value = props.value
  }

  toString() {
    return `"${this.value}"`
  }
}

export class JSNumber extends JSLiteral {
  value: number

  constructor(props: { value: number }) {
    super(props)

    this.value = props.value
  }

  toString() {
    return `{${this.value}}`
  }
}

export class JSBoolean extends JSLiteral {
  value: boolean

  constructor(props: { value: boolean }) {
    super(props)

    this.value = props.value
  }
  toString() {
    return `{${this.value}}`
  }
}
