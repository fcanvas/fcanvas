/* eslint-disable @typescript-eslint/ban-types */
import { isFunction, isPromise } from "@vue/shared"

export function callWithErrorHandling(
  fn: Function,
  type: string,
  args?: unknown[]
) {
  // eslint-disable-next-line functional/no-let
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, type)
  }
  return res
}

export function callWithAsyncErrorHandling(
  fn: Function | Function[],
  type: string,
  args?: unknown[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, type, args)
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, type)
      })
    }
    return res
  }

  const values = []
  // eslint-disable-next-line functional/no-let
  for (let i = 0; i < fn.length; i++)
    values.push(callWithAsyncErrorHandling(fn[i], type, args))

  return values
}

export function handleError(err: unknown, type: string) {
  console.error(new Error(`[src/fns/watch]: ${type}`))
  console.error(err)
}

export function raise(message: string): never {
  // eslint-disable-next-line functional/no-throw-statement
  throw createError(message)
}

export function warn(message: string) {
  console.warn(createError(message))
}

export function createError(message: string) {
  return new Error(`[reactivue]: ${message}`)
}
