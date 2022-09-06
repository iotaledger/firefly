import { WALLET_RS_ERROR_PARAMETERS } from '../../../constants'
import { WalletRsError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'

export function handleInsufficientFundsError(error: IError): void {
    const errorObject = WALLET_RS_ERROR_PARAMETERS?.[WalletRsError.InsufficientFunds]
    logAndNotifyError({ ...errorObject, message: error?.error, type: error.type })
}
