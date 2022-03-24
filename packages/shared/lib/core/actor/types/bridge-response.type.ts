import { BridgeAction } from '../enums'

export type BridgeResponse<T, P> = {
    id: string
    action: BridgeAction
    type: T
    payload?: P
}
