import { FireflyEvent } from '../types'

export interface IRouter {
    next(event?: FireflyEvent): void
    previous(): void

    reset(): void
}
