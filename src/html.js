const { replace } = require('./replacer')

const rTag = /<[A-z]+\s?([\s\S]*?)>/g
const rStringWithStatement = /"([\s\S]*?{{[\s\S]*?}}[\s\S]*?)"/g
const rBlockStatement = /{{.*?#\w+?\s?.+?}}[\s\S]*?{{\/.+?}}/g
const rMustacheStatement = /{{(.+?)}}/g

function parse(html) {
  html = html.replace(rTag, tag => {
    const original = tag
    const toReplace = []

    // For string literals as el.attr value inside the tag
    tag = tag.replace(rStringWithStatement, (string, inner) => {
      let modified = inner.replace(rBlockStatement, '$$$&') // ${{#if}}{{/if}}
      modified = `\{\`${modified}\`\}` // class={`content__main${{#if}}`}

      toReplace.push([string, modified])
      return '' // Remove strings temporarily
    })

    // Do some here for statements outside of string
    tag = tag.replace(rBlockStatement, block => {
      const modified = `{{! HTML_BLOCK_STATEMENT_START}}${block}{{! HTML_BLOCK_STATEMENT_END}}`
      toReplace.push([block, modified])
      return '' // Remove strings temporarily
    })

    // Do some here for statements outside of string
    tag = tag.replace(rMustacheStatement, mustache => {
      const modified = `{{! HTML_MUSTACHE_STATEMENT_START}}${mustache}{{! HTML_MUSTACHE_STATEMENT_END}}`
      toReplace.push([mustache, modified])
      return '' // Remove strings temporarily
    })

    toReplace.forEach(replacement => {
      tag = original.replace(...replacement)
    })

    return tag
  })

  console.log(html)

  return html
}

module.exports = { parse }
