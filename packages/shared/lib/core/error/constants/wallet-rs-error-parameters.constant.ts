import { ClientError, WalletRsError, IotaClientError } from '../enums'
import { IErrorParameters } from '../interfaces'

export const WALLET_RS_ERROR_PARAMETERS: Readonly<{
    [WalletRsError.Client]?: { [key in ClientError]?: Partial<IErrorParameters> }
    [WalletRsError.InsufficientFunds]?: Partial<IErrorParameters>
    [WalletRsError.NoOutputsToConsolidate]?: Partial<IErrorParameters>
    [WalletRsError.IotaClientError]?: { [key in IotaClientError]?: Partial<IErrorParameters> }
}> = {
    [WalletRsError.Client]: {
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
        [ClientError.InsufficientAmount]: {
            localizationKey: 'error.send.insufficientFundsStorageDeposit',
            logToConsole: true,
            saveToErrorLog: false,
            showNotification: true,
        },
    },
    [WalletRsError.InsufficientFunds]: {
        localizationKey: 'error.send.insufficientFundsStorageDeposit',
        logToConsole: true,
        saveToErrorLog: false,
        showNotification: true,
    },
    [WalletRsError.NoOutputsToConsolidate]: {
        localizationKey: 'error.noOutputsToConsolidate',
        logToConsole: true,
        saveToErrorLog: false,
        showNotification: true,
    },
    [WalletRsError.IotaClientError]: {
        [IotaClientError.NoInputs]: {
            localizationKey: `error.send.${IotaClientError.NoInputs}`,
            logToConsole: true,
            saveToErrorLog: false,
            showNotification: true,
        },
        [IotaClientError.NotEnoughBalance]: {
            localizationKey: `error.send.${IotaClientError.NotEnoughBalance}`,
            logToConsole: true,
            saveToErrorLog: false,
            showNotification: true,
        },
    },
}
