import { NetworkMetadata } from '../types'
import { INetworkStatus } from './network-status.interface'

export interface INetwork {
    getMetadata(): NetworkMetadata
    getStatus(): INetworkStatus
}
