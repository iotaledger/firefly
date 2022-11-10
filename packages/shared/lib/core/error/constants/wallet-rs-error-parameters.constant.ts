import { ClientError, WalletRsError, IotaClientError } from '../enums'
import { IErrorParameters } from '../interfaces'

export const WALLET_RS_ERROR_PARAMETERS: Readonly<{
    [WalletRsError.ClientError]?: { [key in ClientError]?: Partial<IErrorParameters> }
    [WalletRsError.InsufficientFunds]?: Partial<IErrorParameters>
    [WalletRsError.IotaClientError]?: { [key in IotaClientError]?: Partial<IErrorParameters> }
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
        [IotaClientError.NoInputs]: {
            localizationKey: `error.send.${IotaClientError.NoInputs}`,
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: true,
        },
        [IotaClientError.NotEnoughBalance]: {
            localizationKey: `error.send.${IotaClientError.NotEnoughBalance}`,
            logToConsole: true,
            saveToErrorLog: true,
            showNotification: true,
        },
    },
}
