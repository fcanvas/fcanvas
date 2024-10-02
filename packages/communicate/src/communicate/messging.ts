import { FnAny, LikeMessagePort, MayBePromise } from "../type"
import { listen } from "./listen"
import { put } from "./put"

interface Messging<Options extends Record<string, (...args: any[]) => any>> {
  onMessage<Fn extends FnAny>(
    port: LikeMessagePort,
    name: string,
    listener: (...args: Parameters<Fn>) => MayBePromise<
      | ({
          return: Awaited<ReturnType<Fn>>
        } & WindowPostMessageOptions)
      | Awaited<ReturnType<Fn>>
    >,
    options?: {
      once?: boolean
      unique?: boolean
      debug?: boolean
    }
  ): () => void
  // eslint-disable-next-line no-redeclare
  onMessage<Name extends keyof Options = keyof Options>(
    port: LikeMessagePort,
    name: Name,
    listener: (...args: Parameters<Options[Name]>) => MayBePromise<
      | ({
          return: Awaited<ReturnType<Options[Name]>>
        } & WindowPostMessageOptions)
      | Awaited<ReturnType<Options[Name]>>
    >,
    options?: {
      once?: boolean
      unique?: boolean
      debug?: boolean
    }
  ): () => void

  sendMessage<Name extends keyof Options>(
    port: LikeMessagePort,
    name: Name,
    ...args: Parameters<Options[Name]>
  ): Promise<Awaited<ReturnType<Options[Name]>>>
  // eslint-disable-next-line no-redeclare
  sendMessage<Fn extends FnAny>(
    port: LikeMessagePort,
    name: string,
    ...args: Parameters<Fn>
  ): Promise<Awaited<ReturnType<Fn>>>

  // eslint-disable-next-line no-redeclare
  sendMessage<Name extends keyof Options>(
    port: LikeMessagePort,
    options: {
      name: Name
      timeout?: number
      signal?: AbortSignal
    } & WindowPostMessageOptions,
    ...args: Parameters<Options[Name]>
  ): Promise<Awaited<ReturnType<Options[Name]>>>
  // eslint-disable-next-line no-redeclare
  sendMessage<Fn extends FnAny>(
    port: LikeMessagePort,
    options: {
      name: string
      timeout?: number
      signal?: AbortSignal
    } & WindowPostMessageOptions,
    ...args: Parameters<Fn>
  ): Promise<Awaited<ReturnType<Fn>>>
}

export function defineMessging<
  T extends Record<string, (...args: any[]) => any>
>(): Messging<T> {
  return {
    onMessage: ((...args: any[]) => {
      listen(...(args as [LikeMessagePort, string, FnAny]))
    }) as any,
    sendMessage: (...args: any[]) => {
      return put(...(args as [LikeMessagePort, string, ...any[]]))
    }
  }
}
