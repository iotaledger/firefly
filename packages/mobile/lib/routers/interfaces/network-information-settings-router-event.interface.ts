import { INode } from '@core/network'
import { IRouterEvent } from '@core/router'
import { NetworkInformationSettingsAction } from '../../contexts/settings'

export interface INetworkInformationSettingsRouterEvent extends IRouterEvent {
    node?: INode
    action?: NetworkInformationSettingsAction
}
