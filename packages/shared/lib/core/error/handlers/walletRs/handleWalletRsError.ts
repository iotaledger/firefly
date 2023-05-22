import { WalletRsError } from '../../enums'
import { IError } from '../../interfaces'
import { handleGenericError } from '../handleGenericError'
import {
    handleClientError,
    handleInsufficientFundsError,
    handleIotaClientError,
    handleNoOutputsToConsolidateError,
} from './subhandlers'

export function handleWalletRsError(error: IError, resetConfirmationPropsOnDenial = true): void {
    if (error?.type) {
        switch (error.type) {
            case WalletRsError.Client.valueOf():
                handleClientError(error, resetConfirmationPropsOnDenial)
                break
            case WalletRsError.InsufficientFunds.valueOf():
                handleInsufficientFundsError(error)
                break
            case WalletRsError.NoOutputsToConsolidate.valueOf():
                handleNoOutputsToConsolidateError(error)
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
