import { getDecimalSeparator } from './getDecimalSeparator'
import { getGroupSeparator } from './getGroupSeparator'

export function parseCurrency(valueString: string, currency: string | undefined = undefined): number {
    // Need to escape the character in the regex in case it is . otherwise it will replace all characters
    const v = valueString?.replace(new RegExp(`\\${getGroupSeparator()}`, 'g'), '')
    const parsedAmount = Number.parseFloat(v?.replace(getDecimalSeparator(currency), '.'))
    return Number.isNaN(parsedAmount) ? 0 : parsedAmount
}
