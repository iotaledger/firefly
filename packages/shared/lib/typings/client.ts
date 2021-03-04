export enum Network {
    Mainnet = 'mainnet',
    Testnet = 'testnet',
    Devnet = 'devnet',
    Comnet = 'comnet',
}

// TODO: use this interface when https://github.com/iotaledger/wallet.rs/pull/373 is merged
export interface Node {
    url: string
    auth?: {
        password: string
        username: string
    }
}

export interface ClientOptions {
    nodes?: string[]
    node?: string
    network?: Network
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
