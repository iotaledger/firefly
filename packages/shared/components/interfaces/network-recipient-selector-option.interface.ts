import { Subject } from '@core/wallet'

export interface INetworkRecipientSelectorOption {
    name: string
    networkAddress: string
    recipient?: Subject
    disabled?: boolean
}
