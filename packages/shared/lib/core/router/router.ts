import { get, Writable } from 'svelte/store'
import { FireflyEvent } from '@core/router'

export abstract class Router<Route> {
    protected history: Route[] = []
    protected readonly routeStore: Writable<Route>

    constructor(protected initialRoute: Route, storeRoute: Writable<Route>) {
        this.routeStore = storeRoute
        this.setRoute(initialRoute)
    }

    private setRoute(route: Route): void {
        this.routeStore.set(route)
    }

    private updateHistory(): void {
        const currentRoute = get(this.routeStore)
        this.history.push(currentRoute)
    }

    protected setNext(route: Route): void {
        if (route) {
            this.updateHistory()
            this.setRoute(route)
        } else {
            console.error('Routing Error: Could not find next route')
        }
    }

    // This function should be implemented in the child router
    next(event?: FireflyEvent): void {
        throw Error(`Unimplemented state machine within custom router!\n
        Called with event: ${event}`)
    }

    previous(): void {
        const previousRoute = this.history.pop()
        if (previousRoute) {
            this.setRoute(previousRoute)
        }
    }

    goTo(route: Route): void {
        if (get(this.routeStore) === route) {
            return
        }
        this.setNext(route)
    }

    reset(): void {
        this.history = []
        this.setRoute(this.initialRoute)
    }

    filterHistory(route: Route): void {
        if (this.history.length && route !== get(this.routeStore)) {
            this.history = this.history.filter((_route) => _route !== route)
        }
    }
}
