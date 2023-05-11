import { Subject } from '@core/wallet'

export interface INetworkRecipientSelectorOption {
    id: number
    name: string
    networkAddress: string
    recipient?: Subject
    disabled?: boolean
}
