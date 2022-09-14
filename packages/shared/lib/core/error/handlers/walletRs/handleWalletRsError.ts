import { IError } from '../../interfaces'
import { WalletRsError } from '../../enums'
import { handleClientError, handleInsufficientFundsError } from './subhandlers'
import { handleGenericError } from '../handleGenericError'

export function handleWalletRsError(error: IError): void {
    if (error?.type) {
        switch (error?.type) {
            case WalletRsError.ClientError:
                handleClientError(error)
                break
            case WalletRsError.InsufficientFunds:
                handleInsufficientFundsError(error)
                break

            default:
                handleGenericError(error)
        }
    } else {
        handleGenericError(error)
    }
}
