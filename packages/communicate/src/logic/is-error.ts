const { toString } = Object.prototype

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isError(err: any): err is Error {
  return toString.call(err) === "[object Error]"
}
