import { WALLET_RS_ERROR_PARAMETERS, CLIENT_ERROR_REGEXES } from '../../../constants'
import { ClientError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'
import { handleGenericError } from '../../handleGenericError'

export function handleClientError(error: IError): void {
    if (error?.type !== 'ClientError') {
        return
    }

    let errorKey
    if (error?.message) {
        switch (true) {
            case CLIENT_ERROR_REGEXES[ClientError.NoSyncedNode].test(error?.message):
                errorKey = ClientError.NoSyncedNode
                break
            case CLIENT_ERROR_REGEXES[ClientError.TimeNotSynced].test(error?.message):
                errorKey = ClientError.TimeNotSynced
                break
        }
        if (errorKey) {
            const errorObject = WALLET_RS_ERROR_PARAMETERS?.[error?.type]?.[errorKey]
            if (errorObject) {
                logAndNotifyError({ ...errorObject, message: error?.message })
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
