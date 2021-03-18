export type FnOut<I = any, O = any> = (i: I) => O

export type DeepMutable<T> = {
    -readonly [P in keyof T]: DeepMutable<T[P]>
}
