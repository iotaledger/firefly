import { localize } from '@core/i18n'
import { showAppNotification } from '@auxiliary/notification'

import { IErrorParameters } from '../interfaces'
import { addError } from '../stores'

/**
 * The base error, containing logic for handling the different
 * error parameters.
 */
export class BaseError extends Error {
    constructor(params?: IErrorParameters) {
        const message = (params?.localizeMessage ? localize(params?.message) : params?.message) ?? ''

        if (params?.logToConsole) {
            console.error(message)
        }

        if (params?.originalError) {
            console.error(params?.originalError)
        }

        if (params?.saveToErrorLog) {
            addError({ ...params, message, type: 'BaseError', time: Date.now() })
        }

        if (params?.showNotification) {
            showAppNotification({
                type: 'error',
                message,
                alert: true,
            })
        }

        super(message)
    }
}
