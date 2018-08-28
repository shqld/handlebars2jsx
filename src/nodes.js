const camelcase = require('camelcase')

const parser = handlebars => {
  const meta = {}

  const parse = node => {
    switch (node.type) {
      case 'Program':
        return Program(node)
      case 'MustacheStatement':
        return MustacheStatement(node)
      case 'ContentStatement':
        return ContentStatement(node)
      case 'PartialStatement':
        return PartialStatement(node)
      case 'BlockStatement':
        return BlockStatement(node)
      default:
        return
    }
  }

  const parseExpr = node => {
    switch (node.type) {
      case 'PathExpression':
        return wrapAsExpression(PathExpression(node))
      case 'StringLiteral':
        return StringLiteral(node)
      default:
        return
    }
  }

  function isHelper(path) {
    return Boolean(handlebars.helpers[path])
  }

  function Program(program) {
    return program.body.map(parse).join('')
  }

  function MustacheStatement({ path, params }) {
    path = PathExpression(path)

    if (!isHelper(path)) {
      return Expression(path) // props
    }

    const args = params.map(PathExpression)
    return FuncCall(path, args)
  }

  const ContentStatement = ({ value }) => {
    return value
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

    return ComponentCall(name, chunkNames, props)
  }

  //  function BlockStatement() {
  //   let ret = a
  //   return ret
  // }

  function PathExpression({ parts }) {
    return PropAccess(parts)
  }

  function StringLiteral({ value }) {
    return `"${value}"`
  }

  return parse
}

function FuncCall(func, ...args) {
  return wrapAsExpression(`${path}(${args.join(', ')})}`)
}

function wrapAsExpression(expr) {
  return `{${expr}}`
}

function PropAccess(...accessors) {
  return accessors.join('.')
}

function ComponentCall(name, chunkPropNames, props) {
  const buf = []

  buf.push(camelcase(name, { pascalCase: true }))

  props.forEach(prop => buf.push(`${prop.key}=${prop.value}`))

  chunkPropNames.forEach(name => buf.push(wrapAsExpression(`...${name}`)))

  return `<${buf.join(' ')} />`
}

module.exports = parser
