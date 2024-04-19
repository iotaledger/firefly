export interface IProtocol {
    version: number
    networkName: string
    bech32Hrp: string
    belowMaxDepth?: number
    tokenSupply: string
}
