import { Writable, writable } from 'svelte/store'

export abstract class Router<IRoute> {
    protected history = writable<IRoute[]>([])
    protected route: Writable<IRoute>

    constructor(protected initialRoute: IRoute, storeRoute: Writable<IRoute>) {
        this.route = storeRoute
    }

    protected setRoute(route: IRoute): void {
        this.route.set(route)
    }

    protected setNext(route: IRoute): void {
        if (route) {
            this.updateHistory(route)
            this.setRoute(route)
        } else {
            console.error('Routing Error: Could not find next route')
        }
    }

    protected updateHistory(newRoute: IRoute): void {
        this.history.update((history) => {
            history.push(newRoute)
            return history
        })
    }

    // Implements the state machine for each router
    abstract next(event: { detail }): void

    previous(): void {
        let previousRoute: IRoute

        this.history.update((history) => {
            previousRoute = history.pop()
            return history
        })

        if (previousRoute) {
            this.setRoute(previousRoute)
        }
    }

    reset(): void {
        this.history.set([])
        this.setRoute(this.initialRoute)
    }
}
