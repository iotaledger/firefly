import { LocaleArguments } from '@core/i18n'

/**
 * Type for the locale function from Svelte's i18n store.
 */
export type Locale = (path: string, args?: LocaleArguments) => string
