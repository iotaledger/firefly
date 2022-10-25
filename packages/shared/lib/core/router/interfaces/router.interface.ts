import { IRouterEvent } from './router-event.interface'

export interface IRouter {
    next(event?: IRouterEvent): void
    previous(): void

    reset?(): void
}
