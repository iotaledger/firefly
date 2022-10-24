import { WALLET_RS_ERROR_PARAMETERS, CLIENT_ERROR_REGEXES } from '../../../constants'
import { IotaClientError, WalletRsError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'
import { handleGenericError } from '../../handleGenericError'

export function handleIotaClientError(error: IError): void {
    const errorMessage = error?.error
    let errorKey
    if (errorMessage) {
        if (CLIENT_ERROR_REGEXES[IotaClientError.NoInputs].test(errorMessage)) {
            errorKey = IotaClientError.NoInputs
        } else if (CLIENT_ERROR_REGEXES[IotaClientError.NotEnoughBalance].test(errorMessage)) {
            errorKey = IotaClientError.NotEnoughBalance
        }

        const errorObject = WALLET_RS_ERROR_PARAMETERS[WalletRsError.IotaClientError][errorKey]
        if (errorObject) {
            logAndNotifyError({ ...errorObject, message: errorMessage, type: error.type })
            return
        }
    }
    handleGenericError(error)
}
