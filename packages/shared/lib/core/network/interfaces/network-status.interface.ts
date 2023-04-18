import { NetworkHealth } from '../enums'

export interface INetworkStatus {
    messagesPerSecond?: number
    referencedRate?: number
    health?: NetworkHealth
    currentMilestone?: number
}
