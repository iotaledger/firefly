import { BridgeErrorType } from '../enums'

export interface BridgeError {
    type: BridgeErrorType
    error: string
}
