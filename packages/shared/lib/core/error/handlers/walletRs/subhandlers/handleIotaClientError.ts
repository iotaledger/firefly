import { WALLET_RS_ERROR_PARAMETERS } from '../../../constants'
import { WalletRsError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'

export function handleIotaClientError(error: IError): void {
    const errorObject = WALLET_RS_ERROR_PARAMETERS?.[WalletRsError.IotaClientError]
    logAndNotifyError({ ...errorObject, message: error?.error, type: error.type })
}
