import { AppContext } from '@core/app'

import { IRouter } from '@core/router'

export interface IRouterManager {
    resetRouters(): void
    resetRouterForAppContext(context: AppContext, resetSubrouters?: boolean): void
    getRouterForAppContext(context: AppContext): IRouter
    openSettings(): void
}
