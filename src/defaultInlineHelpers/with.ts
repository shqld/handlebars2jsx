import * as jsx from '../om/jsxom'
import * as js from '../om/jsom'
import * as hbs from '../hbs'
import { InlineHelperFunction } from '../InlineHelperFunction'

function isBlockStatement(node: hbs.Node): node is hbs.BlockStatement {
  return node.type === 'BlockStatement'
}

const With: InlineHelperFunction = ({ params, node, parse }) => {
  if (isBlockStatement(node) && node.program) {
    return parse(node.program, { context: params })
  }

  throw new Error()
}

export default With
