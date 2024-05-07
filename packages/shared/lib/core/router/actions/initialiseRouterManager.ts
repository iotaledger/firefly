import { IRouterManager, IRouterManagerOptions } from '../interfaces'
import { routerManager } from '../stores'

export function initialiseRouterManager(options: IRouterManagerOptions): void {
    const { extensions } = options
    const _routerManager = {
        ...Object.fromEntries(extensions),
    }
    routerManager.set(<IRouterManager>(<unknown>_routerManager))
}
