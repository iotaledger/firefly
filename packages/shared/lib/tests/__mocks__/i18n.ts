/**
 * NOTE: This mocks the localize function in i18n.ts. Any locale data
 * that has a parameter must have its own logic.
 */

// TODO: create a better logic for locales with parameters

import json from 'shared/locales/en.json'

function flattenObject(object: object, parent?: string, result = {}) {
    for (const key of Object.keys(object)) {
        const propName = parent ? parent + '.' + key : key
        if (typeof object[key] === 'object') {
            flattenObject(object[key], propName, result)
        } else {
            result[propName] = object[key]
        }
    }
    return result
}

function getLocaleData(values?: any) {
    const locales = flattenObject(json)

    if (values?.time != undefined) {
        const timeLocales = {
            'times.day': 'day',
            'times.hour': 'hour',
            'times.minute': 'minute',
            'times.second': 'second',
        }

        Object.keys(timeLocales).forEach((key) => {
            if (values.time > 1 || values.time === 0) {
                locales[key] = `${values.time} ${timeLocales[key]}s`
            } else {
                locales[key] = `${values.time} ${timeLocales[key]}`
            }
        })
    }

    if (values?.prefix != undefined) {
        locales['error.send.wrongAddressPrefix'] = locales['error.send.wrongAddressPrefix'].replace(
            '{prefix}',
            values.prefix
        )
    }

    return locales
}

jest.mock('../../core/i18n', () => ({
    __esModule: true,
    locale: (key: string, optional?: { values: { [key in any]: number | string } }): string =>
        getLocaleData(optional?.values)[key] || '',
    localize: (key: string, optional?: { values: { [key in any]: number | string } }): string =>
        getLocaleData(optional?.values)[key] || '',
}))
