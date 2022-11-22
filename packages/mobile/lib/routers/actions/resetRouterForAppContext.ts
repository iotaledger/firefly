import { AppContext } from '@core/app/enums'

import { getRouterForAppContext, getSubroutersForAppContext } from '../utils'

export function resetRouterForAppContext(context: AppContext, resetSubrouters = false): void {
    const router = getRouterForAppContext(context)
    if (router) {
        if (resetSubrouters) {
            getSubroutersForAppContext(context).forEach((subrouter) => subrouter.reset())
        }

        router.reset()
    } else {
        throw new Error(`No router implementation for the "${context}" context.`)
    }
}
