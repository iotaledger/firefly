/**
 * NOTE: This mocks the localize function in i18n.ts. Any locale data
 * that is used in a test must also be initialized here in this flat
 * format.
 */

// TODO: Write a function later to flatten all of the object
//  property paths in locales/en.json.
const getLocaleData = (value?: number) => {
    const locales = {
        'times.day': 'day',
        'times.hour': 'hour',
        'times.minute': 'minute',
        'times.second': 'second',
    }

    if (value !== undefined) {
        return Object.keys(locales).reduce((acc, key) => {
            if (value > 1 || value === 0) {
                acc[key] = `${value} ${locales[key]}s`
            } else {
                acc[key] = `${value} ${locales[key]}`
            }

            return acc
        }, {})
    }

    return locales
}

jest.mock('../../core/i18n', () => ({
    __esModule: true,
    locale: (key: string, optional?: { values: { time: number } }): string =>
        getLocaleData(optional.values.time)[key] || '',
    localize: (key: string, optional?: { values: { time: number } }): string =>
        getLocaleData(optional.values.time)[key] || '',
}))
