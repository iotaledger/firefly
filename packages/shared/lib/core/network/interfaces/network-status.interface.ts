import { NetworkHealth, NodePlugin } from '../enums'

export interface INetworkStatus {
    messagesPerSecond?: number
    referencedRate?: number
    health?: NetworkHealth
    description?: string
    currentMilestone?: number
    nodePlugins?: NodePlugin[]
}
