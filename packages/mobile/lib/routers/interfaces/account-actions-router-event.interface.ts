import { IRouterEvent } from '@core/router'

import { AccountAction } from '../../contexts/dashboard'

export interface IAccountActionsRouterEvent extends IRouterEvent {
    action?: AccountAction
}
