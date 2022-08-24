import { IError } from '../interfaces'
import { ErrorFromApi } from '../enums'
import { handleClientError } from './handleClientError'
import { handleGenericError } from './handleGenericError'

export function handleErrorFromApi(error: IError): void {
    if (error?.type) {
        switch (error?.type) {
            case ErrorFromApi.ClientError:
                handleClientError(error)
                break
            default:
                handleGenericError(error)
        }
    } else {
        handleGenericError(error)
    }
}
