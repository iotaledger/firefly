import { AddressTypes } from '@iota/types'
import { IIrc27Metadata } from '../interfaces'

export interface INft {
    id: string
    name: string
    issuer: AddressTypes
    metadata: string
    parsedMetadata?: IIrc27Metadata | string
    isOwned: boolean
}
