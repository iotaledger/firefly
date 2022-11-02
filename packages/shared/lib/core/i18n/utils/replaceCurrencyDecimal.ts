import { getDecimalSeparator } from './getDecimalSeparator'

export function replaceCurrencyDecimal(value: string, currency: string | undefined = undefined): string {
    return value.replace('.', getDecimalSeparator(currency))
}
