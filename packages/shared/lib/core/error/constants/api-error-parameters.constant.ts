import { ClientError, ErrorFromApi } from '../enums'
import { IErrorParameters } from '../interfaces'

export const API_ERROR_PARAMETERS: Readonly<
    { [key in ErrorFromApi]?: { [key in ClientError]?: Partial<IErrorParameters> } }
> = {
    [ErrorFromApi.ClientError]: {
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
}
