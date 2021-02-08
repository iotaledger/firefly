export enum Network {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    Devnet = 'devnet',
    Comnet = 'comnet',
}

export interface Node {
    url: string
    password?: string
    username?: string
}

export interface ClientOptions {
    nodes?: Node[]
    node?: Node
    network?: Network
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
