export enum Network {
    Mainnet = 'mainnet',
    Devnet = 'devnet',
    Comnet = 'comnet',
}

export interface ClientOptions {
    nodes?: string[]
    network?: Network
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}

