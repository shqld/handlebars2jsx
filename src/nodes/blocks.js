const utils = require('./utils')

function IfBlock({ params, program, inverse }) {
  if (inverse) {
    return utils.wrapAsExpression(`(${params}) ? ${program} : ${inverse}`)
  } else {
    return utils.wrapAsExpression(`(${params}) && ${program}`)
  }
}

function EachBlock({ params, program, inverse }) {
  return utils.wrapAsExpression(`${params}.map(item => ${program})`)
}

function WithBlock({ params, program }) {
  return program
}

function Default({ path, params }) {
  return utils.FuncCall(path, params)
}

module.exports = { IfBlock, EachBlock, WithBlock, Default }
