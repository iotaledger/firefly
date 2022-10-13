import { MimeType } from '../types'

export interface INftMetadata {
    standard: string
    version: string
    type: MimeType
    uri: string
    name: string
    collectionId: string
    collectionName: string
    royalties: Record<string, number>
    issuerName: string
    description: string
    attributes: { trait_type: string; value: string | number }[]
}
