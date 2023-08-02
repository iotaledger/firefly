import { api } from '../api'
import { TransactionId, OutputId } from '@iota/wallet/out/types'

export function computeOutputId(id: TransactionId, index: number): Promise<OutputId> {
    return api.computeOutputId(id, index)
}
