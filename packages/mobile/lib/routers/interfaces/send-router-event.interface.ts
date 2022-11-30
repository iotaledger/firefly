import { IRouterEvent } from '@core/router'

export interface ISendRouterEvent extends IRouterEvent {
    needsUnlock?: boolean
    addReference?: boolean
}
