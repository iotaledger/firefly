/**
 * NOTE: This mocks the localize function in i18n.ts. Any locale data
 * that is used in a test must also be initialized here in this flat
 * format.
 */

// TODO: Write a function later to flatten all of the object
//  property paths in locales/en.json.
const LOCALE_DATA = {
    'general.time.day': 'day',
    'general.time.days': 'days',
    'general.time.hour': 'hour',
    'general.time.hours': 'hours',
    'general.time.minute': 'minute',
    'general.time.minutes': 'minutes',
    'general.time.second': 'second',
    'general.time.seconds': 'seconds',
}

jest.mock('../../i18n', () => ({
    __esModule: true,
    locale: (key: string): string => LOCALE_DATA[key] || '',
    localize: (key: string): string => LOCALE_DATA[key] || '',
}))
