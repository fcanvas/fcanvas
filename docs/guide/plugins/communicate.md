# @fcanvas/communicate

This package allows a simple connection between MessageChannel-based channels such as `WebWorker`, `IFrame`...

View source code at: https://github.com/tachibana-shin/fcanvas-next

## Install

```bash:no-line-numbers
pnpm add @fcanvas/communicate
```

## Usage

### With `MessageChannel`

```ts
// listen run function
import { listen } from "@fcanvas/communicate"

const { port1, port2 } = new MessageChannel()
port1.start()
port2.start()

listen(port1, "hello world", (name: string) => {
  console.log(`run: hello world '${name}'`)

  return "run done"
})

// call function
import { put } from "@fcanvas/communicate"
console.log(await put(port2, "hello world", "Shin")) // "run done"
```

### With `WebWorker`

::: code-group
```ts [worker.ts]
import { listen } from "@fcanvas/communicate"

listen(self, "hello world", (name: string) => {
  console.log(`run: hello world '${name}'`)

  return "run done"
})
```

```ts [main.ts]
import Worker from "./worker?worker"
import { put } from "@fcanvas/communicate"

const worker = new Worker()

console.log(await put(worker, "hello world", "Shin")) // "run done"
```
:::

## 2-way use

You can use both ways set `listen` to `Worker` or `Threat`

::: code-group
```ts [worker.ts]
import { listen } from "@fcanvas/communicate"

listen(self, "hello world", async (name: string) => {
  console.log(`run: hello world '${name}'`)

  console.log("input: ", await put(self, "get input"))

  return "run done"
})
```

```ts [main.ts]
import Worker from "./worker?worker"
import { put } from "@fcanvas/communicate"

const worker = new Worker()
listen(worker, "get input", () => {
  return document.querySelector("#input").value
})

console.log(await put(worker, "hello world", "Shin")) // "run done"
```
:::

## Docs

`@fcanvas/communicate` provides 3 methods that can be used anywhere

### `listen`

This function to listen and process calls from `put` and `pit` - like is server

```ts
function listen(
  port: LikeMessagePort, // current port to listen and process. Example `self` in `worker`
  name: string, // the name of the listen
  cb: Function, // its handler function takes a sequence of `arguments` passed from `put` or `pit` and returns a result either a `config` or a `promise`
  options?: {
    once?: boolean // if this option is enabled the listener will self-destruct after being called once by `put` or `pit`
  }
): StopListen /** @type () => void */
```

| Name    | Type               | Description                                                                                                                           |
| ------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| port    | LikeMessagePort    | Current port to listen and process. Example `self` in `worker`                                                                        |
| name    | string             | The name of the listen                                                                                                                |
| cb      | Function           | Its handler function takes a sequence of `arguments` passed from `put` or `pit` and returns a result either a `config` or a `Promise` |
| options | `{ once?: boolean }` | if `once: true` is enabled the listener will self-destruct after being called once by `put` or `pit`                                  |

> `cb` normally returns primitive values ​​but if it returns a value that needs `transfer` like `Offscreen` or `ArrayBuffer` return an `Options`
>
> ```ts
> interface Options {
>   return: any // your value return
>   transfer?: Transferable[] // value transfer
>   targetOrigin?: string // This option is only available if communicating with `IFrame`
> }
> ```
>
> ```ts
> listen(self, "get buffer", async () => {
>   const buffer = new Uint8Array([1, 0xf, 0x3]).buffer
>   return {
>     return: buffer,
>     transfer: [buffer]
>   }
> })
> ```

> `listen` returns a `noop` ​​function that, when called, cancels listening

### `put`

This function sends a request to `listen` and returns a `promise` that is the result of `cb` of `listen` -
like is client

```ts
function put<Fn extends (...args: any[]) => any>(
  port: LikeMessagePort, // current port to listen and process. Example `self` in `worker`
  name: string, // name of call
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>>

function put<Fn extends (...args: any[]) => any>(
  port: LikeMessagePort, // current port to listen and process. Example `self` in `worker`
  options: {
    name: string // name of call
    timeout?: number // timeout
    signal?: AbortSignal // controller
    transfer?: Transferable[] // value transfer
    targetOrigin?: string // This option is only available if communicating with `IFrame`
  },
  ...args: Parameters<Fn>
): Promise<ReturnType<Fn>>
```

| Name                 | Type            | Description                                                                                           |
| -------------------- | --------------- | ----------------------------------------------------------------------------------------------------- |
| port                 | LikeMessagePort | Current port to listen and process. Example `self` in `worker`                                        |
| name                 | string          | name of call                                                                                          |
| options.name         | string          | is like `name`                                                                                        |
| options.timeout      | number?         | timeout `listen` returns a result. if timeout without response will generate error `Error('timeout')` |
| options.signal       | AbortSignal?    | if canceled the function will generate an error `Error('aborted')`                                    |
| options.transfer     | Transferable[]? | values ​​to `transfer`                                                                                |
| options.targetOrigin | string?         | This option is only available if communicating with `IFrame`                                          |
| ...args              | any[]           | values ​​to send to `listen`                                                                          |

> `put` returns the value that `cb` of `listen` returns

### `pit` (as `ping`)

This is a shortened function of `put` that takes no response. it also doesn't care if the call has been sent to `listen` or not

The options of this function are identical to `put` except that it does not accept `options.timeout`, `option.signal` and returns nothing.

## TypeScript

This plugin also supports TypeScript strong and weak type inference

Weak inference with `function`:

```ts
interface FnHello {
  (name: string): string
}

listen<FnHello>(self, "hello", (name /** @type string */) => {
  return "done" /** @type string */
})

put<FnHello>(self, "hello", "Shin") // ✔ ok
put<FnHello>(self, "hello", 0) // ❗ error
```

Strong inference with `Record`:

```ts
interface Connect {
  hello(name: string): void
}

listen<Connect>("self", "hello", () => {}) // ✔ ok
listen<Connect>("self", "hellx", () => {}) // ❗ error

put<Connect>(self, "hello", "Shin") // ✔ ok
put<Connect>(self, "hello", 0) // ❗ error
put<Connect>(self, "hello") // ❗ error
put<Connect>(self, "hellx", "Shin") // ❗ error
```

## Copyright

MIT - (c) 2022-now Tachibana Shin (橘しん)
