import { LocaleArguments } from './locale-arguments.type'

/**
 * The type for the locale functionality.
 */
export type Locale = (path: string, args?: LocaleArguments) => string
