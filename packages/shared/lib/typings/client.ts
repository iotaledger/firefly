export enum Network {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    Devnet = 'devnet',
    Comnet = 'comnet',
}

export interface Node {
    url: string
    auth?: {
        password: string
        username: string
    },
    enabled: boolean
}

export interface ClientOptions {
    nodes?: Node[]
    node?: Node
    customNodes?: Node[]
    network?: Network
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
