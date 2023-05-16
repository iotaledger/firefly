import { IIrc30Metadata } from '@core/wallet'

export interface ILayer2NativeToken {
    id: string
    amount: bigint
    metadata?: IIrc30Metadata
}
