import { TokenStandard } from '@core/wallet'
import { MimeType } from '../types'
import { IIrc27Attribute } from './irc27-attribute.interface'

export interface IIrc27Metadata {
    standard: TokenStandard.Irc27
    version: string
    type: MimeType
    uri: string
    name: string
    collectionName?: string
    royalties?: Record<string, number>
    issuerName?: string
    description?: string
    attributes?: IIrc27Attribute[]
}
