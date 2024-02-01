import { NetworkHealth } from '../enums'

export interface INetworkStatus {
    messagesPerSecond?: string
    confirmationRate?: string
    health?: NetworkHealth
    currentSlot?: number
}
