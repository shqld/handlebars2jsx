global.log = console.log
global.dump = require('dumper.js').dd
// global.dump = obj => log(JSON.stringify(obj, null, 1))

const fs = require('fs')
const handlebars = require('handlebars')
const cheerio = require('cheerio')

const parser = require('./nodes')
const htmlParser = require('./html')

const load = p => fs.readFileSync(require.resolve(p), 'utf8')

handlebars.registerPartial('content', `{{title}}`)
// handlebars.registerHelper('title', () => {})

let hbs = load('./sample.hbs')

hbs = htmlParser.parse(hbs)

// const $ = cheerio.load(hbs)

// log(
//   Object.entries(
//     $('body')
//       .children()
//       .first()
//       .attr()
//   )
// )

// const ast = handlebars.parse(hbs)
// const parse = parser(handlebars)

// log(parse(ast))
// dump(ast)

// dump(handlebars.partials)

// const compile = handlebars.compile(hbs)
// const html = compile({
//   title: 'hello',
//   ctx: {
//     title: 'world',
//   },
// })
// log(html)
