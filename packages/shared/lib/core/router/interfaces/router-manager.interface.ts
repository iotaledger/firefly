import { AppContext } from '@core/app'

import { IRouter } from '@core/router'

export interface IRouterManager {
    getAppRouter(): IRouter
    getRouterForAppContext(context: AppContext): IRouter
    goToAppContext(context: AppContext): void
    openSettings(): void
    resetRouterForAppContext(context: AppContext, resetSubrouters?: boolean): void
    resetRouters(): void
}
