/* eslint-disable @typescript-eslint/no-explicit-any */
export type FnAny = (...args: any[]) => any
export type MayBePromise<T> = Awaited<T> | Promise<Awaited<T>>
export interface WindowPostMessageOptions {
  targetOrigin?: string
  transfer?: Transferable[]
}
export interface LikeMessagePort {
  // eslint-disable-next-line functional/no-method-signature
  addEventListener(
    name: "message",
    cb: (event: MessageEvent<any>) => void,
    options?: unknown
  ): void
  // eslint-disable-next-line functional/no-method-signature
  removeEventListener(
    name: "message",
    cb: (event: MessageEvent<any>) => void,
    options?: unknown
  ): void
  // eslint-disable-next-line functional/no-method-signature
  postMessage(message: any, options?: unknown): void
}
export interface DataCallFn<Fn extends (...args: unknown[]) => unknown> {
  id: string
  type: "call_fn"
  name: string
  args: Parameters<Fn>
  ping?: true
}
export type DataReturnFn<Fn extends (...args: unknown[]) => unknown> =
  | {
      id: string
      type: "return_fn"
      name: string
      isOk: true
      retu: ReturnType<Fn>
    }
  | {
      id: string
      type: "return_fn"
      name: string
      isOk: false
      retu: string
    }
