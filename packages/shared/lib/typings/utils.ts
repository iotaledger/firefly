/**
 * Creates a union of all the property types of an interface T.
 */
export type ValuesOf<T> = T[keyof T] | T
