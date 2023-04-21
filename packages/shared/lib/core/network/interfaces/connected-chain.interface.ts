import { NetworkHealth } from '../enums'

export interface ConnectedChain {
    name: string
    address: string
    status: NetworkHealth
}
