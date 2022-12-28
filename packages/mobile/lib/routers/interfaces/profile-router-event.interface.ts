import { IRouterEvent } from '@core/router'

export interface IProfileRouterEvent extends IRouterEvent {
    settings?: boolean
    networkStatus?: boolean
}
