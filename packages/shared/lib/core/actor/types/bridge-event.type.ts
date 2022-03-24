import { BridgeResponseType } from '@core/actor'

export type BridgeEvent<T> = {
    action: string
    id: string
    type: BridgeResponseType
    payload: T
}
