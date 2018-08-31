import * as jsx from '../om/jsxom'
import * as js from '../om/jsom'
import { InlineHelperFunction } from '../InlineHelperFunction'

const If: InlineHelperFunction = ({
  params,
  program,
  inverse,
  node,
  parse,
}) => {
  if (inverse) {
    return new jsx.JSXExpression({
      value: `(${params}) ? ${program} : ${inverse}`,
    })
  } else {
    program = parse(node.program, { isContentString: true })
    return new jsx.JSXExpression({ value: `(${params}) && ${program}` })
  }
}

export default If
