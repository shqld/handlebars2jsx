import fs from 'fs'
import path from 'path'
import * as jsx from './om/jsxom'
import * as hbs from './hbs'
import { InlineHelperFunction } from './InlineHelperFunction'

const defaultHelpersDir = path.resolve(
  'node_modules/handlebars/lib/handlebars/helpers'
)
const defaultInlineHelpersDir = path.join(__dirname, 'defaultInlineHelpers')

export type InlineHelper = {
  name: string
  inline: boolean
  func: InlineHelperFunction
}

export function isInline(helper: Helper): helper is InlineHelper {
  return helper.inline
}

export type Helper =
  | {
      name: string
      inline: boolean
      code?: string
    }
  | InlineHelper

export type Helpers = {
  [name: string]: Helper
}

const arr2obj = (arr: Array<Helper>): Helpers =>
  arr.reduce((acc, f) => Object.assign(acc, { [f.name]: f }), {})

const getNormalHelpers = (dir: string): Helpers =>
  arr2obj(
    fs
      .readdirSync(dir)
      .map(p => path.join(dir, p))
      .map(p => ({
        name: path.parse(p).name,
        inline: false,
        code: fs.readFileSync(p, 'utf8'),
      }))
  )

const getInlineHelpers = (dir: string): Helpers =>
  arr2obj(
    fs
      .readdirSync(dir)
      .map(p => path.join(dir, p))
      .map(p => ({
        name: path.parse(p).name,
        inline: true,
        func: require(p).default,
      }))
  )

export const getHelpers = (
  helpersDir: Array<string> = [],
  inlineHelpersDirs: Array<string> = []
): Helpers => {
  const helpers: Helpers = {}

  // As default
  Object.assign(helpers, getNormalHelpers(defaultHelpersDir))
  Object.assign(helpers, getInlineHelpers(defaultInlineHelpersDir))

  helpersDir.forEach(dir => Object.assign(helpers, getNormalHelpers(dir)))
  inlineHelpersDirs.forEach(dir =>
    Object.assign(helpers, getInlineHelpers(dir))
  )

  return helpers
}
