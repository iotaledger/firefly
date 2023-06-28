import { WALLET_RS_ERROR_PARAMETERS } from '../../../constants'
import { WalletRsError } from '../../../enums'
import { IError } from '../../../interfaces'
import { logAndNotifyError } from '../../../actions'
import { localize } from '@core/i18n'

export function handleInsufficientFundsError(error: IError): void {
    const errorObject = WALLET_RS_ERROR_PARAMETERS?.[WalletRsError.InsufficientFunds]
    const message =
        localize('error.send.insufficientFundsStorageDeposit') + ' ' + localize('error.send.ongoingTransaction')

    // The localizationKey is overwritten as undefined, since the message is localized above
    logAndNotifyError({ ...errorObject, localizationKey: undefined, message, type: error.type })
}
