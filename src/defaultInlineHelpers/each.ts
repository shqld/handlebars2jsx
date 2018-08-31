import * as jsx from '../om/jsxom'
import * as js from '../om/jsom'
import { InlineHelperFunction } from '../InlineHelperFunction'

const Each: InlineHelperFunction = ({ params, program, inverse }) => {
  if (inverse) {
    return new jsx.JSXExpression({
      value: `${params}.map(item => ${program}) || ${inverse}`,
    })
  }
  return new jsx.JSXExpression({ value: `${params}.map(item => ${program})` })
}

export default Each
