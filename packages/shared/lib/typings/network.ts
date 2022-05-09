import { NodePlugin } from '@core/network'

export type NetworkStatus = {
    messagesPerSecond?: number
    referencedRate?: number
    health?: number
    healthText?: NetworkStatusHealthText
    currentMilestone?: number
    nodePlugins?: NodePlugin[]
}

export enum NetworkStatusHealthText {
    Down = 'networkDown',
    Degraded = 'networkDegraded',
    Operational = 'networkOperational',
}
