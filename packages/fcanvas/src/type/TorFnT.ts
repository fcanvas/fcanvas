export type TorFnT<T, H> = (T & ThisType<T>) | ((this: void, _this: H) => T)
