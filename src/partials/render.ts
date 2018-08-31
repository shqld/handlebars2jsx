import fs from 'fs'
import path from 'path'

export type Partial = {
  fileName: string
  content: string
}

export default (partials: Array<Partial>, basePath: string) => {
  const baseDir = path.dirname(basePath)

  // FIXME:
  // partials.forEach(partial => {
  //   fs.writeFileSync(
  //     path.join(baseDir, partial.fileName + '.hbs'),
  //     partial.content
  //   )
  // })
}
