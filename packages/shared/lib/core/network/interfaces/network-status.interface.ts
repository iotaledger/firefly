import { NodePlugin } from '../enums'
import { NetworkStatusDescription } from '../enums/network-status-description.enum'

export interface INetworkStatus {
    messagesPerSecond?: number
    referencedRate?: number
    health?: number
    description?: NetworkStatusDescription
    currentMilestone?: number
    nodePlugins?: NodePlugin[]
}
