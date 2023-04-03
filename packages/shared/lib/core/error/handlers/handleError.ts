import { get } from 'svelte/store'

import { Platform } from '@core/app/classes'
import { handleLedgerError } from '@core/ledger/utils'
import { ProfileType } from '@core/profile/enums'
import { activeProfile } from '@core/profile/stores'

import { WalletRsError } from '../enums'
import { handleGenericError } from './handleGenericError'
import { IError } from '../interfaces'
import { handleWalletRsError } from './walletRs'

export interface IErrorHandlerParams {
    resetConfirmationPropsOnDenial?: boolean
    sendToTracker?: boolean
}

export const DEFAULT_ERROR_HANDLER_PARAMS: IErrorHandlerParams = {
    resetConfirmationPropsOnDenial: true,
    sendToTracker: true,
}

export function handleError(err: IError, errorHandlerParams: IErrorHandlerParams = DEFAULT_ERROR_HANDLER_PARAMS): void {
    const { resetConfirmationPropsOnDenial, sendToTracker } = errorHandlerParams

    if (sendToTracker) {
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
