import { logAndNotifyError } from '@core/error/actions'
import { WALLET_RS_ERROR_PARAMETERS } from '@core/error/constants'
import { WalletRsError } from '@core/error/enums'
import { IError } from '@core/error/interfaces'

export function handleNoOutputsToConsolidateError(error: IError): void {
    const errorObject = WALLET_RS_ERROR_PARAMETERS?.[WalletRsError.NoOutputsToConsolidate]
    logAndNotifyError({ ...errorObject, message: error?.error, type: error.type })
}
