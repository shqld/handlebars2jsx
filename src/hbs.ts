export interface Node {
  type: string
  loc: SourceLocation | null
}

export interface SourceLocation {
  source: string | null
  start: Position
  end: Position
}

export interface Position {
  line: number
  column: number
}

export interface Program extends Node {
  type: 'Program'
  body: Array<Statement>

  blockParams: Array<string>
}

export interface Statement extends Node {}

export interface MustacheStatement extends Statement {
  type: 'MustacheStatement'

  path: PathExpression | Literal
  params: Array<Expression>
  hash: Hash

  escaped: boolean
  strip: StripFlags | null
}

export interface BlockStatement extends Statement {
  type: 'BlockStatement'
  path: PathExpression | Literal
  params: Array<Expression>
  hash: Hash

  program: Program | null
  inverse: Program | null

  openStrip: StripFlags | null
  inverseStrip: StripFlags | null
  closeStrip: StripFlags | null
}

export interface PartialStatement extends Statement {
  type: 'PartialStatement'
  name: PathExpression | SubExpression
  params: Array<Expression>
  hash: Hash

  indent: string
  strip: StripFlags | null
}

export interface PartialBlockStatement extends Statement {
  type: 'PartialBlockStatement'
  name: PathExpression | SubExpression
  params: Array<Expression>
  hash: Hash

  program: Program | null

  indent: string
  openStrip: StripFlags | null
  closeStrip: StripFlags | null
}

export interface ContentStatement extends Statement {
  type: 'ContentStatement'
  value: string
  original: string
}

export interface CommentStatement extends Statement {
  type: 'CommentStatement'
  value: string

  strip: StripFlags | null
}

export interface Decorator extends Statement {
  type: 'Decorator'

  path: PathExpression | Literal
  params: Array<Expression>
  hash: Hash

  strip: StripFlags | null
}

export interface DecoratorBlock extends Statement {
  type: 'DecoratorBlock'
  path: PathExpression | Literal
  params: Array<Expression>
  hash: Hash

  program: Program | null

  openStrip: StripFlags | null
  closeStrip: StripFlags | null
}

export interface Expression extends Node {}

export interface SubExpression extends Expression {
  type: 'SubExpression'
  path: PathExpression
  params: Array<Expression>
  hash: Hash
}

export interface PathExpression extends Expression {
  type: 'PathExpression'
  data: boolean
  depth: number
  parts: Array<string>
  original: string
}

export interface Literal extends Expression {}

export interface StringLiteral extends Literal {
  type: 'StringLiteral'
  value: string
  original: string
}

export interface BooleanLiteral extends Literal {
  type: 'BooleanLiteral'
  value: boolean
  original: boolean
}

export interface NumberLiteral extends Literal {
  type: 'NumberLiteral'
  value: number
  original: number
}

export interface UndefinedLiteral extends Literal {
  type: 'UndefinedLiteral'
}

export interface NullLiteral extends Literal {
  type: 'NullLiteral'
}

export interface Hash extends Node {
  type: 'Hash'
  pairs: Array<HashPair>
}

export interface HashPair extends Node {
  type: 'HashPair'
  key: string
  value: Expression
}

export interface StripFlags {
  open: boolean
  close: boolean
}
