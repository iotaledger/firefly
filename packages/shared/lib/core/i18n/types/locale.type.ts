import { LocaleArguments } from '@core/i18n'

export type Locale = (path: string, args?: LocaleArguments) => string
