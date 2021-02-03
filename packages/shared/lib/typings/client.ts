export enum Network {
    Mainnet = 'mainnet',
    Devnet = 'testnet2',
    Comnet = 'comnet',
}

export interface ClientOptions {
    nodes?: string[]
    network?: Network
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}

