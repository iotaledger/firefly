import { showAppNotification } from '@lib/notifications'

import { IErrorParameters } from '../interfaces'

export class BaseError extends Error {
    constructor(params?: IErrorParameters) {
        const message = params?.message ?? ''

        if (params?.logError) {
            console.error(message)
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
