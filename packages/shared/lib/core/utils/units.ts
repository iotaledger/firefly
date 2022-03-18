/**
 * Returns true if a value is within the corresponding range given a unit.
 */
export const isValueInUnitRange = (value: number, unit: string): boolean => {
    const ki = 1000,
        mi = 1000000,
        gi = 1000000000,
        ti = 1000000000000,
        pi = 1000000000000000

    switch (unit) {
        case 'ki':
            return value >= ki && value <= mi
        case 'mi':
            return value >= mi && value <= gi
        case 'gi':
            return value >= gi && value <= ti
        case 'ti':
            return value >= ti && value <= pi
        case 'pi':
            return value >= pi
        default:
            return false
    }
}
/**
 * Returns a raw IOTA amount given a string-formatted amount (e.g. 10 Mi, 1.23 Gi).
 */
export const unitToValue = (str: string): number => {
    const value = parseInt(str, 10)
    const unit = str.substring(value.toString().length).toLowerCase()

    switch (unit) {
        case 'ki':
            return value * 1000
        case 'mi':
            return value * 1000000
        case 'gi':
            return value * 1000000000
        case 'ti':
            return value * 1000000000000
        case 'pi':
            return value * 1000000000000000
        default:
            return value
    }
}
