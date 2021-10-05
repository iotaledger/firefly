export enum Network {
    ChrysalisMainnet = 'chrysalis-mainnet',
    ChrysalisTestnet = 'chrysalis-testnet',
}

export type NetworkStatus = {
    messagesPerSecond?: number
    referencedRate?: number
    health?: number
}
