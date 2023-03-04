# Reactivity Watch API

## watchEffect()

This function is used to listen for changes. It was written by me because it is not available in `@vue/reactivity`

Similar usage [watchEffect in Vue](https://vuejs.org/api/reactivity-core.html#watcheffect)

Runs a function immediately while reactively tracking its dependencies and re-runs it whenever the dependencies are changed.

- **Type**

```ts
function watchEffect(
  effect: (onCleanup: OnCleanup) => void,
  options?: WatchEffectOptions
): StopHandle

type OnCleanup = (cleanupFn: () => void) => void

interface WatchEffectOptions {
  flush?: "pre" | "post" | "sync" // default: 'pre'
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

type StopHandle = () => void
```

- **Details**

The first argument is the effect function to be run. The effect function receives a function that can be used to register a cleanup callback. The cleanup callback will be called right before the next time the effect is re-run, and can be used to clean up invalidated side effects, e.g. a pending async request (see example below).

The second argument is an optional options object that can be used to adjust the effect's flush timing or to debug the effect's dependencies.

By default, watchers will run just prior to component rendering. Setting `flush: 'post'` will defer the watcher until after component rendering. See Callback Flush Timing for more information. In rare cases, it might be necessary to trigger a watcher immediately when a reactive dependency changes, e.g. to invalidate a cache. This can be achieved using `flush: 'sync'`. However, this setting should be used with caution, as it can lead to problems with performance and data consistency if multiple properties are being updated at the same time.

The return value is a handle function that can be called to stop the effect from running again.

- **Example**

```ts
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

count.value++
// -> logs 1
```

Side effect cleanup:

```ts
watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value)
  // `cancel` will be called if `id` changes
  // so that previous pending request will be cancelled
  // if not yet completed
  onCleanup(cancel)
  data.value = await response
})
```

Stopping the watcher:

```ts
const stop = watchEffect(() => {})

// when the watcher is no longer needed:
stop()
```

Options:

```ts
watchEffect(() => {}, {
  flush: "post",
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

## watchPostEffect()

Alias of [watchEffect()](#watchEffect) with `flush: 'post'` option.

## watchSyncEffect()

Alias of [watchEffect()](#watchEffect) with `flush: 'sync'` option.

## watch()

Watches one or more reactive data sources and invokes a callback function when the sources change.

- **Type**
  ```ts
  // watching single source
  function watch<T>(
    source: WatchSource<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
  ): StopHandle
  // watching multiple sources
  function watch<T>(
    sources: WatchSource<T>[],
    callback: WatchCallback<T[]>,
    options?: WatchOptions
  ): StopHandle
  type WatchCallback<T> = (
    value: T,
    oldValue: T,
    onCleanup: (cleanupFn: () => void) => void
  ) => void
  type WatchSource<T> =
    | Ref<T> // ref
    | (() => T) // getter
    | T extends object
    ? T
    : never // reactive object
  interface WatchOptions extends WatchEffectOptions {
    immediate?: boolean // default: false
    deep?: boolean // default: false
    flush?: "pre" | "post" | "sync" // default: 'pre'
    onTrack?: (event: DebuggerEvent) => void
    onTrigger?: (event: DebuggerEvent) => void
  }
  ```
  > Types are simplified for readability.
- **Details**
  `watch()` is lazy by default - i.e. the callback is only called when the watched source has changed.
  The first argument is the watcher's **source**. The source can be one of the following:
  - A getter function that returns a value
  - A ref
  - A reactive object
  - ...or an array of the above.
    The second argument is the callback that will be called when the source changes. The callback receives three arguments: the new value, the old value, and a function for registering a side effect cleanup callback. The cleanup callback will be called right before the next time the effect is re-run, and can be used to clean up invalidated side effects, e.g. a pending async request.
    When watching multiple sources, the callback receives two arrays containing new / old values corresponding to the source array.
    The third optional argument is an options object that supports the following options:
  - **`immediate`**: trigger the callback immediately on watcher creation. Old value will be `undefined` on the first call.
  - **`deep`**: force deep traversal of the source if it is an object, so that the callback fires on deep mutations. See [Deep Watchers](https://vuejs.org/guide/essentials/watchers#deep-watchers).
  - **`flush`**: adjust the callback's flush timing. See [Callback Flush Timing](https://vuejs.org/guide/essentials/watchers#callback-flush-timing) and [`watchEffect()`](https://vuejs.orgapi/reactivity-core.html#watcheffect).
  - **`onTrack / onTrigger`**: debug the watcher's dependencies. See [Watcher Debugging](https://vuejs.org/guide/extras/reactivity-in-depth#watcher-debugging).
    Compared to [`watchEffect()`](#watcheffect), `watch()` allows us to:
  - Perform the side effect lazily;
  - Be more specific about what state should trigger the watcher to re-run;
  - Access both the previous and current value of the watched state.
- **Example**
  Watching a getter:
  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state.count,
    (count, prevCount) => {
      /* ... */
    }
  )
  ```
  Watching a ref:
  ```js
  const count = ref(0)
  watch(count, (count, prevCount) => {
    /* ... */
  })
  ```
  When watching multiple sources, the callback receives arrays containing new / old values corresponding to the source array:
  ```js
  watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
  })
  ```
  When using a getter source, the watcher only fires if the getter's return value has changed. If you want the callback to fire even on deep mutations, you need to explicitly force the watcher into deep mode with `{ deep: true }`. Note in deep mode, the new value and the old will be the same object if the callback was triggered by a deep mutation:
  ```js
  const state = reactive({ count: 0 })
  watch(
    () => state,
    (newValue, oldValue) => {
      // newValue === oldValue
    },
    { deep: true }
  )
  ```
  When directly watching a reactive object, the watcher is automatically in deep mode:
  ```js
  const state = reactive({ count: 0 })
  watch(state, () => {
    /* triggers on deep mutation to state */
  })
  ```
  `watch()` shares the same flush timing and debugging options with [`watchEffect()`](#watcheffect):
  ```js
  watch(source, callback, {
    flush: "post",
    onTrack(e) {
      debugger
    },
    onTrigger(e) {
      debugger
    }
  })
  ```
  Stopping the watcher:
  ```js
  const stop = watch(source, callback)
  // when the watcher is no longer needed:
  stop()
  ```
  Side effect cleanup:
  ```js
  watch(id, async (newId, oldId, onCleanup) => {
    const { response, cancel } = doAsyncWork(newId)
    // `cancel` will be called if `id` changes, cancelling
    // the previous request if it hasn't completed yet
    onCleanup(cancel)
    data.value = await response
  })
  ```
