import { NetworkHealth } from '../enums'

export interface IConnectedChain {
    name: string
    address: string
    status: NetworkHealth
}
