import { IRouterEvent } from '../types'

export interface IRouter {
    next(event?: IRouterEvent): void
    previous(): void

    reset?(): void
}
