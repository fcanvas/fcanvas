import type { DataCallFn, FnAny, LikeMessagePort } from "../type"

function pit<
  Options extends Record<any, FnAny>,
  Name extends keyof Options = keyof Options
>(port: LikeMessagePort, name: Name, ...args: Parameters<Options[Name]>): void
// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  name: string,
  ...args: Parameters<Fn>
): void

// eslint-disable-next-line no-redeclare
function pit<
  Options extends Record<any, FnAny>,
  Name extends keyof Options = keyof Options
>(
  port: LikeMessagePort,
  options:
    | {
        name: Name
      } & WindowPostMessageOptions,
  ...args: Parameters<Options[Name]>
): void
// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  options: {
    name: string
  } & WindowPostMessageOptions,
  ...args: Parameters<Fn>
): void

// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  options: {
    name: string
  } & WindowPostMessageOptions,
  ...args: Parameters<Fn>
): void

// eslint-disable-next-line no-redeclare
function pit<Options extends Record<any, FnAny>>(
  port: LikeMessagePort
): <Name extends keyof Options>(
  name: Name,
  ...args: Parameters<Options[Name]>
) => Promise<Awaited<ReturnType<Options[Name]>>>
// eslint-disable-next-line no-redeclare
function pit<Options extends Record<any, FnAny>>(
  port: LikeMessagePort
): <Name extends keyof Options>(
  options: {
    name: Name
  } & WindowPostMessageOptions,
  ...args: Parameters<Options[Name]>
) => Promise<Awaited<ReturnType<Options[Name]>>>

// eslint-disable-next-line no-redeclare
function pit<Fn extends FnAny>(
  port: LikeMessagePort,
  options?:
    | string
    | ({
        name: string
      } & WindowPostMessageOptions),
  // eslint-disable-next-line functional/functional-parameters
  ...args: Parameters<Fn>
): void | Function {
  if (!options)
    return (
      name: Exclude<typeof options, undefined>,
      ...args: Parameters<Fn>
    ) => pit(port, name, ...args)
  // eslint-disable-next-line functional/no-let
  let name: string
  if (typeof options === "object") name = options.name
  else name = options

  const message: DataCallFn<Fn> = {
    id: "0",
    type: "call_fn",
    name,
    args,
    ping: true
  }
  port.postMessage(message, typeof options === "object" ? options : undefined)
}

export { pit }
