import { INode } from '@core/network'
import { IRouterEvent } from '@core/router'
import { NetworkConfigurationSettingsAction } from '../../contexts/settings'

export interface INetworkConfigurationSettingsRouterEvent extends IRouterEvent {
    node?: INode
    action?: NetworkConfigurationSettingsAction
}
