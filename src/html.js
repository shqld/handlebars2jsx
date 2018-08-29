const cheerio = require('cheerio')

const rTag = /<[A-z]+\s?([\s\S]*?)>/g
const rStringWithStatement = /"([\s\S]*?{{[\s\S]*?}}[\s\S]*?)"/g
const rBlockStatement = /{{.*?#\w+?\s?.+?}}([\s\S]*?)({{else}}[\s\S]*?)?{{\/.+?}}/g
const rMustacheStatement = /{{(.+?)}}/g

const counter = () => {
  let counter = 0
  return () => counter++
}

const getCount = counter()

function parse(html, handlebars) {
  html = html.replace(rTag, tag => {
    const original = tag
    const buf = []
    const statements = {}

    // Remove strings temporarily
    tag = tag.replace(rStringWithStatement, (string, inner) => {
      buf.push([string, string])
      return ''
    })

    tag = tag.replace(rBlockStatement, (block, inner) => {
      const count = getCount()
      const key = `statement-${count}`
      statements[key] = block
      buf.push([block, `${key}-${inner.trim()}`])

      return ''
    })

    tag = tag.replace(rMustacheStatement, mustache => {
      const count = getCount()
      const key = `statement-${count}`
      statements[key] = mustache
      buf.push([mustache, key])

      return ''
    })

    tag = original
    buf.forEach(replacement => {
      tag = tag.replace(...replacement)
    })

    const $ = cheerio.load(tag)

    const tagAttrs = $('body')
      .children()
      .first()
      .attr()

    parseAttrTemplate(tagAttrs, statements, handlebars)

    return tag
  })

  console.log(html)
  console.log('=================================================')

  return html
}

const kStatement = 'statement-'

const parseAttrTemplate = (attrs, statements, handlebars) => {
  const normalAttrs = {}
  const dynamicAttrs = {}
  let hasDynamicAttrs = false

  Object.entries(attrs).forEach((k, v) => {
    // if (v.startsWith(kStatement)) {
    //   normalAttrs[k] = statements[v]
    //   return
    // }

    // if (k!.startsWith(kStatement)) {

    //   return
    // }

    hasDynamicAttrs = true

    const ast = handlebars.parse(k)
    dump(ast)

    // Dynamic attribute
    if (v) {
      //
    } else {
      //
    }
  })
}

module.exports = { parse }
