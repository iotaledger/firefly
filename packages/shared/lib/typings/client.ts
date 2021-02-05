export enum Network {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    Devnet = 'devnet',
    Comnet = 'comnet',
}

export interface ClientOptions {
    nodes?: string[]
    node?: string;
    network?: Network
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}

