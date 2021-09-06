/**
 * Creates a union of all the property types of an interface T including T itself.
 */
export type ValuesOf<T> = T[keyof T] | T
