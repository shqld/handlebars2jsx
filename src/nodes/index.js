const camelcase = require('camelcase')

const utils = require('./utils')
const blocks = require('./blocks')

const parser = handlebars => {
  const meta = {}

  const parse = (node, opts = {}) => {
    switch (node.type) {
      case 'Program':
        return Program(node, opts)
      case 'MustacheStatement':
        return MustacheStatement(node, opts)
      case 'ContentStatement':
        return ContentStatement(node, opts)
      case 'PartialStatement':
        return PartialStatement(node, opts)
      case 'BlockStatement':
        return BlockStatement(node, opts)
      case 'CommentStatement':
        return CommentStatement(node, opts)
      default:
        return
    }
  }

  const parseExpr = node => {
    switch (node.type) {
      case 'PathExpression':
        return utils.wrapAsExpression(PathExpression(node))
      case 'StringLiteral':
        return StringLiteral(node)
      default:
        return
    }
  }

  const isHelper = path => {
    return Boolean(handlebars.helpers[path])
  }

  const programType = str => {
    str = str.replace(/\n/g, '').trim()

    if (/^({[^{}]+?})+$/.test(str)) {
      return 'expression'
    }

    if (/^<.+ .*>$/.test(str)) {
      return 'element'
    }

    // TODO: split into string and templateLiteral and literal(number, boolean...)
    return 'literal'
  }

  function Program(program, opts = {}) {
    const parsed = program.body
      .map(node => parse(node, opts))
      .join('')
      .trim()

    if (opts.noWrap) {
      return parsed
    }

    switch (programType(parsed)) {
      case 'expression':
        return parsed
      case 'element':
        return `(\n${parsed}\n)`
      case 'literal':
        return `\`${parsed}\``
    }
  }

  const ContentStatement = ({ value }) => {
    return value
  }

  function MustacheStatement({ path, params, ...node }, opts) {
    path = PathExpression(path, opts)

    if (!isHelper(path)) {
      return `\{${path}\}` // as a prop
    }

    const args = params.map(PathExpression)
    return utils.FuncCall(path, args)
  }

  function BlockStatement(node, opts) {
    const path = PathExpression(node.path, opts)
    const params = node.params.map(PathExpression)
    const program = Program(node.program)
    const inverse = node.inverse && Program(node.inverse)

    switch (path) {
      case 'if':
        return blocks.IfBlock({ path, params, program, inverse })
      case 'each':
        return blocks.EachBlock({ path, params, program, inverse })
      case 'with':
        return blocks.WithBlock({
          params,
          program: Program(node.program, { context: params }),
        })
      default:
        return blocks.Default({ path, params, program, inverse })
    }
  }

  function PartialStatement({ name, params, hash }) {
    name = PathExpression(name) // TODO:

    const chunkNames = params.map(PathExpression) || []

    // TODO: Consider type of value
    const props =
      hash && hash.pairs
        ? hash.pairs.map(({ key, value }) => {
            return { key, value: parseExpr(value) }
          })
        : []

    return utils.ComponentCall(name, chunkNames, props)
  }

  function CommentStatement({ value }) {
    value = value.trim()

    if (value.startsWith('IGNORED')) {
      return `/* ${value} */`
    }

    return ''
  }

  function PathExpression({ parts }, opts) {
    if (opts.context) {
      parts = [opts.context, ...parts]
    }

    return utils.PropAccess(...parts)
  }

  function StringLiteral({ value }) {
    return `"${value}"`
  }

  const initialOpts = {
    noWrap: true, // Because outmost rendered html is jsx literal
  }

  return hbs => parse(hbs, initialOpts)
}

module.exports = parser
