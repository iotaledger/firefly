import { get } from 'svelte/store'

import { IRouter } from '@core/router/interfaces'
import { appRouter } from '../routers'

export function getAppRouter(): IRouter {
    return get(appRouter)
}
