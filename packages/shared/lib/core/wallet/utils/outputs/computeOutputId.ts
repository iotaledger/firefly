import { TransactionId, OutputId } from '@iota/sdk/out/types'
import { api } from '@core/api'

export function computeOutputId(id: TransactionId, index: number): OutputId {
    return api.computeOutputId(id, index)
}
