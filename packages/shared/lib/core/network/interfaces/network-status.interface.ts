import { NetworkHealth, NodePlugin } from '../enums'
import { NetworkStatusDescription } from '../constants/network-status-description.enum'

export interface INetworkStatus {
    messagesPerSecond?: number
    referencedRate?: number
    health?: NetworkHealth
    description?: string
    currentMilestone?: number
    nodePlugins?: NodePlugin[]
}
