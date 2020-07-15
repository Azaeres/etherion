// https://templecoding.com/blog/real-immutable-types-with-typescript
export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
}
