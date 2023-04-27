import { IGasFeePolicy } from './gas-fee-policy.interface'
import { IGasLimits } from './gas-limits.interface'

export interface IIscpChainMetadata {
    chainID: string
    evmChainId: number
    chainOwnerId: string
    isActive: boolean
    gasLimits: IGasLimits
    gasFeePolicy: IGasFeePolicy
    customMetadata: unknown
}

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IEvmChainMetadata {}
