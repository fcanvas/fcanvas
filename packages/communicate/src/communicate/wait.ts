import { ArgumentsType } from "vitest"
import { FnAny, LikeMessagePort } from "../type"
import { listen } from "./listen"

// eslint-disable-next-line no-redeclare
function wait<Fn extends (...args: any) => Promise<void> | void>(
  port: LikeMessagePort,
  name: string,
  timeout?: number,
  debug?: boolean
): Promise<ArgumentsType<Fn>>
// eslint-disable-next-line no-redeclare
function wait<
  Options extends Record<string, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  name: Name,
  timeout?: number,
  debug?: boolean
): Promise<ArgumentsType<Options[Name]>>

function wait<Fn extends (...args: any) => Promise<void> | void>(
  port: LikeMessagePort,
  name: string,
  timeout?: number,
  debug?: boolean
) {
  return new Promise<any>((resolve, reject) => {
    const timeoutId =
      timeout && timeout > 0
        ? setTimeout(() => {
            listener()
            reject(new Error("timeout"))
          }, timeout)
        : null
    const listener = listen(
      port,
      name,
      (...args) => {
        timeoutId && clearTimeout(timeoutId)
        resolve(args)
      },
      { once: true, debug }
    )
  })
}

export { wait }
