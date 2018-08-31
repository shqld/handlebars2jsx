import camelcase from 'camelcase'
import * as jsx from '../om/jsxom'
import * as js from '../om/jsom'
import * as hbs from '../hbs'

export type Partial = {
  fileName: string
  content: string
}

export default (node: jsx.JSXNode, registeredPartials: Object) => {
  function resolvePartials(
    node: jsx.JSXNode,
    partials: Array<Partial> = []
  ): Array<Partial> {
    if (node instanceof jsx.JSXComponent) {
      partials.push(toPartial(node))
    }

    if (node instanceof jsx.JSXElement) {
      node.children.forEach(child => resolvePartials(child, partials))
    }

    return partials
  }

  function toPartial({ fileName }: jsx.JSXComponent): Partial {
    const content = registeredPartials[fileName]

    return { fileName, content }
  }

  return resolvePartials(node)
}
