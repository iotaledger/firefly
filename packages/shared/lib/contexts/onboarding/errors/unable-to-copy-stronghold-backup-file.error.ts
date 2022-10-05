import { BaseError, DEFAULT_APP_ERROR_PARAMETERS } from '@core/error'

export class UnableToCopyStrongholdBackupFileError extends BaseError {
    constructor() {
        super({
            ...DEFAULT_APP_ERROR_PARAMETERS,
            message: 'error.backup.unableToCopyFile',
        })
    }
}
