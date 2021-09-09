import type { Node } from './node'
import type { Network } from './network'

export interface ClientOptions {
    node: Node
    nodes: Node[]
    network: string | Network
    localPow: boolean
    nodeSyncEnabled?: boolean
    nodeSyncInterval?: Date
    nodePoolUrls?: string[]
    mqttEnabled?: boolean
    mqttBrokerOptions?: MqttBrokerOptions
}

export interface MqttBrokerOptions {
    automaticDisconnect?: boolean
    timeout?: Date
    useWs?: boolean
    maxReconnectionAttempts?: number
}
