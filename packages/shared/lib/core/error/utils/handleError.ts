import { IErrorParameters } from '../interfaces'

import { localize } from '@core/i18n'
import { showAppNotification } from '@lib/notifications'
import { addError } from '../stores'

export function handleError(errorParameters: IErrorParameters): void {
    const localisedMessage = errorParameters?.localizationKey
        ? localize(errorParameters?.localizationKey)
        : localize('error.global.generic')

    if (errorParameters?.logToConsole) {
        console.error(errorParameters?.message)
    }

    if (errorParameters?.saveToErrorLog) {
        addError(errorParameters)
    }

    if (errorParameters?.showNotification) {
        showAppNotification({
            alert: true,
            type: 'error',
            message: localisedMessage,
        })
    }
}
