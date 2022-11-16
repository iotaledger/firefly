import { TokenStandard } from '@core/wallet'
import { MimeType } from '../types'

export interface IIrc27Metadata {
    standard: TokenStandard.IRC27
    version: string
    type: MimeType
    uri: string
    name: string
    collectionName?: string
    royalties?: Record<string, number>
    issuerName?: string
    description?: string
    attributes?: { trait_type: string; value: string | number }[]
}
