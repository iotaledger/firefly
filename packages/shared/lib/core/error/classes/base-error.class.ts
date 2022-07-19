import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'

import { IErrorParameters } from '../interfaces'

export class BaseError extends Error {
    constructor(params?: IErrorParameters) {
        const message = (params?.localizeMessage ? localize(params?.message) : params?.message) ?? ''

        if (params?.logToConsole) {
            console.error(message)
        }

        if (params?.saveToErrorLog) {
            // TODO: save to log
        }

        if (params?.showNotification) {
            showAppNotification({
                type: 'error',
                message,
            })
        }

        super(message)
    }
}
