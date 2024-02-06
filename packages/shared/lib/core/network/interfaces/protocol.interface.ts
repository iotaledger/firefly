import { IRentStructure } from './rent-structure.interface'

export interface IProtocol {
    version: number
    networkName: string
    bech32Hrp: string
    // minPowScore: number
    belowMaxDepth?: number
    rentStructure: IRentStructure
    tokenSupply: string
}
