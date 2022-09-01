import { WALLET_RS_ERROR_PARAMETERS, CLIENT_ERROR_REGEXES } from '../../../constants'
import { ClientError, WalletRsError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'
import { handleGenericError } from '../../handleGenericError'

export function handleClientError(error: IError): void {
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
        }
        if (errorKey) {
            const errorObject = WALLET_RS_ERROR_PARAMETERS?.[WalletRsError.ClientError]?.[errorKey]
            if (errorObject) {
                logAndNotifyError({ ...errorObject, message: errorMessage })
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
