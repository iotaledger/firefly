import { get } from 'svelte/store'

import { IRouterManager, IRouterManagerOptions } from '../interfaces'
import { routerManager } from '../stores'

export function initialiseRouterManager(options: IRouterManagerOptions): void {
    if (get(routerManager)) {
        throw new Error('Router manager has already been initialised.')
    } else {
        const { extensions } = options
        const _routerManager = {
            ...Object.fromEntries(extensions),
        }
        routerManager.set(<IRouterManager>(<unknown>_routerManager))
    }
}
