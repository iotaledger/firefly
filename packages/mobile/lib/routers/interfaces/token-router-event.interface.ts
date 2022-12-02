import { IRouterEvent } from '@core/router'
import { IAsset } from '@core/wallet'

export interface ITokenRouterEvent extends IRouterEvent {
    asset?: IAsset
}
