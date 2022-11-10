import { AppContext } from '@core/app/enums'

import { getRouterForAppContext } from '../utils'

export function resetRouterForAppContext(context: AppContext): void {
    const router = getRouterForAppContext(context)
    if (router) {
        router.reset()
    } else {
        throw new Error(`No router implementation for the "${context}" context.`)
    }
}
