import { DownloadErrorType, DownloadWarningType } from '../enums'

export interface NftDownloadMetadata {
    isLoaded: boolean
    error?: {
        type: DownloadErrorType
        message?: string
    }
    warning?: {
        type: DownloadWarningType
        message?: string
    }
}
