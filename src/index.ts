declare const log: Function
declare const dump: Function

// @ts-ignore
global.log = console.log
// @ts-ignore
global.dump = require('dumper.js').dd

import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import prettier from 'prettier'

import parse from './parse'
import render from './render'
import wrapAsFile from './wrapAsFile'
import * as Html from './html'
import * as Partial from './partials'

const load = (p: string) => fs.readFileSync(p, 'utf8')

/* Register built-in/user helpers & partials */
handlebars.registerPartial('asdf', `{{title}}`)
handlebars.registerPartial('asdf/title', `{{title}}`)
// handlebars.registerHelper('title', () => {})

const hbsPath = path.resolve('src/sample.hbs') // FIXME: Get the path from user as an arg

const hbs = load(hbsPath)

const cleansedHbs = Html.cleanse(hbs)
// log(hbs)
// log('=================================================================')

const ast = handlebars.parse(cleansedHbs)
const jsx = parse(ast)

const partials = Partial.resolve(jsx, handlebars.partials)
Partial.render(partials, hbsPath)

// dump(handlebars.partials)
// dump(ast)
// log('=================================================================')
// log(jsx)
// log('=================================================================')

// log(jsx.toString())

const file = wrapAsFile(jsx.toString())
log(file)
const prettyFile = prettier.format(file)
log(prettyFile)

// render(file, hbsPath)

// const compile = handlebars.compile(hbs)
// const html = compile({
//   parentToo: 'parent',
//   parentOnly: 'parent',
//   child: {
//     parentToo: 'child',
//   },
// })
// log(html)
