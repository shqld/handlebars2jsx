import * as jsx from './om/jsxom'
import * as hbs from './hbs'

export type InlineHelperFunction = (
  {
    params,
    program,
    inverse,
    node,
    parse,
  }: {
    params: Array<string>
    program?: jsx.JSXElement | null
    inverse?: jsx.JSXElement | null
    node: hbs.Node
    parse: (ast: hbs.Node, opts: Object) => jsx.JSXNode
  }
) => jsx.JSXNode
