import { ClientError, WalletRsError } from '../enums'
import { IErrorParameters } from '../interfaces'

export const WALLET_RS_ERROR_PARAMETERS: Readonly<{
    [WalletRsError.ClientError]?: { [key in ClientError]?: Partial<IErrorParameters> }
    [WalletRsError.InsufficientFunds]?: Partial<IErrorParameters>
    [WalletRsError.IotaClientError]?: Partial<IErrorParameters>
}> = {
    [WalletRsError.ClientError]: {
        [ClientError.NoSyncedNode]: {
            localizationKey: `error.node.${ClientError.NoSyncedNode}`,
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: true,
        },
        [ClientError.TimeNotSynced]: {
            localizationKey: `error.node.${ClientError.TimeNotSynced}`,
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: true,
        },
    },
    [WalletRsError.InsufficientFunds]: {
        localizationKey: 'error.send.insufficientFundsStorageDeposit',
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    },
    [WalletRsError.IotaClientError]: {
        localizationKey: 'error.send.noInputs',
        logToConsole: true,
        saveToErrorLog: true,
        showNotification: true,
    },
}
