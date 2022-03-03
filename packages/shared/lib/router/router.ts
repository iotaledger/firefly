import { Writable, writable } from 'svelte/store'

export class Router<IRoute> {
    protected history = writable<IRoute[]>([])
    public route: Writable<IRoute>

    constructor(protected initialRoute: IRoute, storeRoute: Writable<IRoute>) {
        this.route = storeRoute
    }

    protected setRoute(route: IRoute): void {
        this.route.set(route)
    }

    public previous(): void {
        let previousRoute: IRoute

        this.history.update((history) => {
            previousRoute = history.pop()
            return history
        })

        if (previousRoute) {
            this.setRoute(previousRoute)
        }
    }

    public next(route: IRoute): void {
        if (route) {
            this.updateHistory(route)
            this.setRoute(route)
        } else {
            console.error('Routing Error: Could not find next route')
        }
    }

    public reset(): void {
        this.history.set([])
        this.setRoute(this.initialRoute)
    }

    public updateHistory(newRoute: IRoute): void {
        this.history.update((history) => {
            history.push(newRoute)
            return history
        })
    }
}
