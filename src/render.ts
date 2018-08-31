import fs from 'fs'
import path from 'path'

export default (jsx, srcPath) => {
  const { dir, name } = path.parse(srcPath)

  const renderPath = path.format({
    dir,
    name,
    ext: '.jsx',
  })

  // fs.writeFileSync(renderPath, jsx) // FIXME:
}
