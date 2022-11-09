import { get } from 'svelte/store'

import { AppContext } from '@core/app/enums'
import { IRouter } from '@core/router/interfaces'
import { loginRouter } from '@core/router/subrouters'

export function getRouterForAppContext(context: AppContext): IRouter {
    switch (context) {
        case AppContext.Login:
            return get(loginRouter)
        default:
            return undefined
    }
}
