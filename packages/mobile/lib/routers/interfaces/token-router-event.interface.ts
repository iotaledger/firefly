import { IRouterEvent } from '@core/router'
import { IAsset } from '@core/wallet'

import { TokenAction } from '../../contexts/dashboard'

export interface ITokenRouterEvent extends IRouterEvent {
    asset?: IAsset
    action?: TokenAction
}
