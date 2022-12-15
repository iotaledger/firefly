import { IRouterEvent } from '@core/router'
import { SettingsRoute } from '../enums'

export interface ISettingsRouterEvent extends IRouterEvent {
    goTo?: SettingsRoute
}
