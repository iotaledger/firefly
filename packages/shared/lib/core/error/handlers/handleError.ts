import { get } from 'svelte/store'

import { Platform } from '@core/app/classes'
import { handleLedgerError } from '@core/ledger/utils'
import { ProfileType } from '@core/profile/enums'
import { activeProfile } from '@core/profile/stores'

import { DEFAULT_ERROR_HANDLER_PARAMETERS } from '../constants'
import { WalletRsError } from '../enums'
import { handleGenericError } from './handleGenericError'
import { IError } from '../interfaces'
import { handleWalletRsError } from './walletRs'

export function handleError(err: IError, errorHandlerParameters = DEFAULT_ERROR_HANDLER_PARAMETERS): void {
    const { resetConfirmationPropsOnDenial, sendToTracker } = errorHandlerParameters

    if (sendToTracker) {
        /* eslint-disable no-console */
        console.log('SENDING ERROR: ', err)
        Platform.captureException(err)
    }

    const _activeProfile = get(activeProfile)
    if (Object.values(WalletRsError).includes(err?.type as WalletRsError)) {
        handleWalletRsError(err)
    } else if (_activeProfile.type === ProfileType.Ledger) {
        handleLedgerError(err, resetConfirmationPropsOnDenial)
    } else {
        handleGenericError(err)
    }
}
