import { IRouterEvent } from '@core/router'
import { ActivityRoute } from '../enums'

export interface IActivityRouterEvent extends IRouterEvent {
    backToDashboard?: boolean
    route: ActivityRoute
}
