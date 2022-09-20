import { WalletApiEventPayload } from '../types'

export interface IWalletApiEventPayloadWrapper {
    accountIndex: number
    payload: WalletApiEventPayload
}
