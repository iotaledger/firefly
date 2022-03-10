import { get, Writable } from 'svelte/store'

export abstract class Router<IRoute> {
    // TODO make protected
    protected history: IRoute[] = []
    protected readonly routeStore: Writable<IRoute>

    constructor(protected initialRoute: IRoute, storeRoute: Writable<IRoute>) {
        this.routeStore = storeRoute
        this.setRoute(initialRoute)
    }

    private setRoute(route: IRoute): void {
        this.routeStore.set(route)
    }

    private updateHistory(): void {
        const currentRoute = get(this.routeStore)
        this.history.push(currentRoute)
    }

    protected setNext(route: IRoute): void {
        if (route) {
            this.updateHistory()
            this.setRoute(route)
        } else {
            console.error('Routing Error: Could not find next route')
        }
    }

    // This function should be implemented in the child router
    next(_?: CustomEvent): void {
        throw Error('Unimplemented state machine within custom router!')
    }

    previous(): void {
        const previousRoute = this.history.pop()
        if (previousRoute) {
            this.setRoute(previousRoute)
        }
    }

    goTo(route: IRoute): void {
        if (get(this.routeStore) === route) {
            return
        }
        this.setNext(route)
    }

    reset(): void {
        this.history = []
        this.setRoute(this.initialRoute)
    }
}
