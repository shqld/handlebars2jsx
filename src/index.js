global.log = console.log
global.dump = require('dumper.js').dd

const fs = require('fs')
const handlebars = require('handlebars')

const parser = require('./nodes')
const htmlParser = require('./html')

const load = p => fs.readFileSync(require.resolve(p), 'utf8')

/* Register built-in/user helpers & partials */
handlebars.registerPartial('content', `{{title}}`)
// handlebars.registerHelper('title', () => {})

let hbs = load('./sample.hbs')

hbs = htmlParser.cleanse(hbs, handlebars)
log(hbs)
log('=================================================================')

// const ast = handlebars.parse(hbs)
// // dump(ast)
// const parse = parser(handlebars)
// const jsx = parse(ast)
// log('=================================================================')
// log(jsx)
// log('=================================================================')

// dump(handlebars.partials)

// const compile = handlebars.compile(hbs)
// const html = compile({
//   parentToo: 'parent',
//   parentOnly: 'parent',
//   child: {
//     parentToo: 'child',
//   },
// })
// log(html)
