import fs from 'fs'
import path from 'path'

export default jsx => {
  const wrapper = fs.readFileSync(path.join(__dirname, 'wrapper.txt'), 'utf8')

  return wrapper.replace('HBS2JSX INSERT_JSX_CONTENT', jsx)
}
