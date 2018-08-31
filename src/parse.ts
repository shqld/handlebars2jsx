import * as jsx from './om/jsxom'
import * as js from './om/jsom'
import * as hbs from './hbs'
import { getHelpers, isInline } from './helpers'

const helpers = getHelpers()

type ParseOptions = {
  context?: string
}

const parse = (ast: hbs.Node, opts: ParseOptions = {}): jsx.JSXNode => {
  let isInsideElement = false

  const innerParse = (node: hbs.Node): jsx.JSXNode => {
    switch (node.type) {
      case 'Program':
        return Program(node as hbs.Program)
      case 'MustacheStatement':
        return MustacheStatement(node as hbs.MustacheStatement)
      case 'ContentStatement':
        return ContentStatement(node as hbs.ContentStatement)
      case 'PartialStatement':
        return PartialStatement(node as hbs.PartialStatement)
      case 'BlockStatement':
        return BlockStatement(node as hbs.BlockStatement)
      case 'CommentStatement':
        return CommentStatement(node as hbs.CommentStatement)
      default:
        return new jsx.JSXText({ values: [] })
    }
  }

  const parseExpr = (node: any): jsx.JSXExpression | js.JSString => {
    switch (node.type) {
      case 'PathExpression':
        return new jsx.JSXExpression({
          value: new js.JSString({ value: PathExpression(node) }),
        })
      case 'StringLiteral':
        return new js.JSString({ value: node.value })
      case 'NumberLiteral':
        return new js.JSString({ value: node.value })
      case 'BooleanLiteral':
        return new js.JSString({ value: node.value })
      default:
        return new js.JSString({ value: '' })
    }
  }

  function Program(program: hbs.Program): jsx.JSXElement {
    return new jsx.JSXElement({
      children: program.body.map(innerParse),
    })
  }

  function ContentStatement({ value }: hbs.ContentStatement): jsx.JSXText {
    if (opts.isContentString) {
      value = value.trim()
      return new js.JSString({ value })
    }
    return new jsx.JSXText({ values: value })
  }

  function MustacheStatement(node: hbs.MustacheStatement): jsx.JSXExpression {
    const path = PathExpression(node.path)

    const helper = helpers[path]

    if (!helper) {
      return new jsx.JSXExpression({ value: path }) // as a prop
    }

    const args = node.params.map(PathExpression)

    if (isInline(helper)) {
      return new jsx.JSXExpression({
        value: helper.func({ params: args, node, parse }),
      })
    }

    return new jsx.JSXExpression({
      value: new js.JSFunction({ name: path, args }),
    })
  }

  function BlockStatement(node: hbs.BlockStatement): jsx.JSXNode {
    const path = PathExpression(node.path)
    const params = node.params.map(PathExpression)
    const program = node.program && Program(node.program)
    const inverse = node.inverse && Program(node.inverse)

    const helper = helpers[path]

    if (!helper) {
      throw new Error(`No such helper function: ${path}`)
    }

    if (isInline(helper)) {
      return helper.func({ params, program, inverse, node, parse })
    }

    return new jsx.JSXExpression({
      value: new js.JSFunction({ name: path, args: params }),
    })
  }

  function PartialStatement(node: hbs.PartialStatement): jsx.JSXComponent {
    const name = PathExpression(node.name) // TODO:

    const chunkProps = node.params.map(PathExpression) || []

    // TODO: Consider type of value
    const props =
      node.hash && node.hash.pairs
        ? node.hash.pairs.map(({ key, value }) => {
            return { key, value: parseExpr(value) }
          })
        : []

    return new jsx.JSXComponent({
      name,
      chunkProps,
      props,
      fileName: name,
    })
  }

  function CommentStatement({ value }: hbs.CommentStatement): jsx.JSXComment {
    value = value.trim()

    if (!value.startsWith('HBS2JSX')) {
      return new jsx.JSXComment()
    }

    const [, type] = value.split(' ')

    switch (type) {
      case 'HTML_ELEMENT_START':
        isInsideElement = true
        return new jsx.JSXComment()
      case 'HTML_ELEMENT_END':
        isInsideElement = false
        return new jsx.JSXComment()
      case 'IGNORED':
        return new jsx.JSXComment({ value: `/* ${value} */` })
      default:
        return new jsx.JSXComment()
    }
  }

  type LiteralWithValue =
    | hbs.StringLiteral
    | hbs.BooleanLiteral
    | hbs.NumberLiteral

  function isLiteralWithValue(node: hbs.Literal): node is LiteralWithValue {
    return (
      node.type.endsWith('Literal') &&
      (<LiteralWithValue>node).value != undefined
    )
  }

  function isPathExpression(node: hbs.Node): node is hbs.PathExpression {
    return node.type === 'PathExpression'
  }

  function PathExpression(node: hbs.PathExpression | hbs.Literal): string {
    if (isLiteralWithValue(node)) {
      return node.value.toString()
    }

    // Not UndefinedLiteral nor Null Literal
    if (!isPathExpression(node)) {
      return ''
    }

    if (opts.context) {
      node.parts = [opts.context, ...node.parts]
    }

    return node.parts.join('.')
  }

  return innerParse(ast)
}

export default parse
