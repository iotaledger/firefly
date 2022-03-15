import { LocaleArguments } from '@core/i18n'

/**
 * The type for the locale function from Svelte's i18n store.
 */
export type Locale = (path: string, args?: LocaleArguments) => string
