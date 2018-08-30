const genKey = require('uuid/v4')
const voidElements = require('html-void-elements')

const rTag = /<[A-z]+\s?([\s\S]*?)>/g
const rStringWithStatement = /"([\s\S]*?{{[\s\S]*?}}[\s\S]*?)"/g

const rBlockStatement = /{{.*?#\w+?\s?.+?}}[\s\S]*?{{\/.+?}}/g
const rMustacheStatement = /{{(.+?)}}/g

const rEndTag = /<\/[A-z]+>/g
const rVoidElements = new RegExp(
  `<(${voidElements.join('|')})[\\s\\S]*?/?>`,
  'g'
)

const mStartTag = '{{!-- HBS2JSX HTML_ELEMENT_START --}}'
const mEndTag = '{{!-- HBS2JSX HTML_ELEMENT_END --}}'
const wrapIgnored = ignored => `{{!-- HBS2JSX IGNORED ${ignored} --}}`

function cleanse(html, handlebars) {
  html = html.replace(rTag, tag => {
    const buf = []

    tag = tag.replace(rStringWithStatement, (_, inner) => {
      let modified = inner
      modified = modified.replace(rBlockStatement, '$$$&')
      modified = modified.replace(rMustacheStatement, '$$$&')

      modified = `\{\`${modified}\`\}`

      const key = genKey()
      buf.push([key, modified])

      return key
    })

    // Prevent handlebars from parsing incorrectly
    tag = tag.replace(rBlockStatement, (block, offset) => {
      const key = genKey()

      const beforeIndex = offset - 1
      if (beforeIndex >= 0 && tag[beforeIndex] === '=') {
        buf.push([key, block])
      } else {
        buf.push([key, wrapIgnored(block)])
      }

      return key
    })

    // Prevent handlebars from parsing incorrectly
    tag = tag.replace(rMustacheStatement, (mustache, offset) => {
      const key = genKey()

      const beforeIndex = offset - 1
      if (beforeIndex >= 0 && tag[beforeIndex] === '=') {
        buf.push([key, mustache])
      } else {
        buf.push([key, wrapIgnored(mustache)])
      }

      return key
    })

    buf.forEach(replacement => {
      tag = tag.replace(...replacement)
    })

    if (rVoidElements.test(tag)) {
      tag = `${mStartTag}\n${tag}\n${mEndTag}`
    } else {
      tag = `${mStartTag}\n${tag}`
    }

    return tag
  })

  html = html.replace(rEndTag, `$&\n${mEndTag}`)

  // log(html)
  // log('========================================================')

  return html
}

const rHtmlElement = /^<.+ .*>$/

function isElement(str) {
  str = str.replace(/\n/g, '').trim()
  return rHtmlElement.test(str)
}

module.exports = { cleanse, isElement }
