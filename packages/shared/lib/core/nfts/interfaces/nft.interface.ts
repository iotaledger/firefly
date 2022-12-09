import { AddressTypes } from '@iota/types'
import { IIrc27Metadata } from '../interfaces'

export interface INft {
    id: string
    address: string
    name: string
    metadata?: string
    issuer?: AddressTypes
    parsedMetadata?: IIrc27Metadata
    isSpendable: boolean
    latestOutputId: string
}
