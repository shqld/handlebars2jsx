function FuncCall(func, ...args) {
  return wrapAsExpression(`${func}(${args.join(', ')})`)
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

module.exports = { FuncCall, wrapAsExpression, PropAccess, ComponentCall }
