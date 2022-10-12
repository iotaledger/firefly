import { IError } from '../../interfaces'
import { WalletRsError } from '../../enums'
import { handleClientError, handleInsufficientFundsError, handleIotaClientError } from './subhandlers'
import { handleGenericError } from '../handleGenericError'

export function handleWalletRsError(error: IError): void {
    if (error?.type) {
        switch (error.type) {
            case WalletRsError.ClientError.valueOf():
                handleClientError(error)
                break
            case WalletRsError.InsufficientFunds.valueOf():
                handleInsufficientFundsError(error)
                break
            case WalletRsError.IotaClientError.valueOf():
                handleIotaClientError(error)
                break

            default:
                handleGenericError(error)
        }
    } else {
        handleGenericError(error)
    }
}
