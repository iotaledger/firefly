import { handleLedgerError } from '@core/ledger/utils'
import { LedgerError } from '@core/ledger/enums'

import { WALLET_RS_ERROR_PARAMETERS, CLIENT_ERROR_REGEXES } from '../../../constants'
import { ClientError, WalletRsError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'
import { handleGenericError } from '../../handleGenericError'
import { handleInsufficientFundsError } from './handleInsufficientFundsError'

export function handleClientError(error: IError, resetConfirmationPropsOnDenial = true): void {
    const errorMessage = error?.error
    if (errorMessage) {
        switch (true) {
            case CLIENT_ERROR_REGEXES[ClientError.NoSyncedNode].test(errorMessage):
                replaceErrorKeyAndHandle(error, ClientError.NoSyncedNode)
                return
            case CLIENT_ERROR_REGEXES[ClientError.TimeNotSynced].test(errorMessage):
                replaceErrorKeyAndHandle(error, ClientError.TimeNotSynced)
                return
            case CLIENT_ERROR_REGEXES[ClientError.InsufficientAmount].test(errorMessage):
                handleInsufficientFundsError({ type: ClientError.InsufficientAmount })
                return
            case Object.values(LedgerError).some((ledgerError) => errorMessage.includes(ledgerError)):
                handleLedgerError(error, resetConfirmationPropsOnDenial)
                return
            default:
                handleGenericError(error)
                return
        }
    } else {
        handleGenericError(error)
    }
}

function replaceErrorKeyAndHandle(error: IError, errorKey: ClientError): void {
    const errorObject = WALLET_RS_ERROR_PARAMETERS?.[WalletRsError.Client]?.[errorKey]

    // Condition error.error is always satisfied, since this is checked on l.11
    if (errorObject && error.error) {
        logAndNotifyError({ ...errorObject, message: error.error, type: error.type })
    } else {
        handleGenericError(error)
    }
}
