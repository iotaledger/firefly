import { WALLET_RS_ERROR_PARAMETERS, CLIENT_ERROR_REGEXES } from '../../../constants'
import { ClientError, WalletRsError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'
import { handleGenericError } from '../../handleGenericError'
import { handleLedgerError } from '@core/ledger/utils'
import { LedgerError } from '@core/ledger/enums'

export function handleClientError(error: IError, resetConfirmationPropsOnDenial = true): void {
    const errorMessage = error?.error
    let errorKey
    if (errorMessage) {
        switch (true) {
            case CLIENT_ERROR_REGEXES[ClientError.NoSyncedNode].test(errorMessage):
                errorKey = ClientError.NoSyncedNode
                break
            case CLIENT_ERROR_REGEXES[ClientError.TimeNotSynced].test(errorMessage):
                errorKey = ClientError.TimeNotSynced
                break
            case CLIENT_ERROR_REGEXES[ClientError.InsufficientAmount].test(errorMessage):
                errorKey = ClientError.InsufficientAmount
                break
            case Object.values(LedgerError).some((ledgerError) => errorMessage.includes(ledgerError)):
                handleLedgerError(error, resetConfirmationPropsOnDenial)
                return
        }
        if (errorKey) {
            const errorObject = WALLET_RS_ERROR_PARAMETERS?.[WalletRsError.Client]?.[errorKey]
            if (errorObject) {
                logAndNotifyError({ ...errorObject, message: errorMessage, type: error.type })
            } else {
                handleGenericError(error)
            }
        } else {
            handleGenericError(error)
        }
    } else {
        handleGenericError(error)
    }
}
