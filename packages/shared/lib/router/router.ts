import { get, Writable, writable } from 'svelte/store'

export abstract class Router<IRoute> {
    // TODO make protected
    public history = writable<IRoute[]>([])
    public route: Writable<IRoute>

    constructor(protected initialRoute: IRoute, storeRoute: Writable<IRoute>) {
        this.route = storeRoute
        this.setRoute(initialRoute)
    }

    private setRoute(route: IRoute): void {
        this.route.set(route)
    }

    private updateHistory(): void {
        const currentRoute = get(this.route)
        this.history.update((history) => {
            history.push(currentRoute)
            return history
        })
    }

    protected setNext(route: IRoute): void {
        if (route) {
            this.updateHistory()
            this.setRoute(route)
        } else {
            console.error('Routing Error: Could not find next route')
        }
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
