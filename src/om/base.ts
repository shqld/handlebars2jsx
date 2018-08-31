export default class Base {
  // type: string

  constructor(props: Object) {
    // this.type = this.constructor.name
  }

  static create(props: Object) {
    return new this(props)
  }
}
