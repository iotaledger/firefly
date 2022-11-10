import { AppContext } from '@core/app'

import { IRouter } from '@core/router'

export interface IRouterManager {
    resetRouters(): void
    resetRouterForAppContext(context: AppContext): void
    getRouterForAppContext(context: AppContext): IRouter
}
