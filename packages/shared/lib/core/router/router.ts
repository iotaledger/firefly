import { get, Writable, writable } from 'svelte/store'

export abstract class Router<IRoute> {
    // TODO make protected
    public history = writable<IRoute[]>([])
    public routeStore: Writable<IRoute>

    constructor(protected initialRoute: IRoute, storeRoute?: Writable<IRoute>) {
        this.routeStore = storeRoute ?? writable<IRoute>(null)
        this.setRoute(initialRoute)
    }

    private setRoute(route: IRoute): void {
        this.routeStore.set(route)
    }

    private updateHistory(): void {
        const currentRoute = get(this.routeStore)
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

    // Watch out! This is not reactive!
    get route(): IRoute {
        return get(this.routeStore)
    }

    // This function should be implemented in the child router
    next(_: CustomEvent): void {
        throw Error('Unimplemented state machine within custom router!')
    }

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

    goTo(route: IRoute): void {
        if (get(this.routeStore) === route) {
            return
        }
        this.setNext(route)
    }

    reset(): void {
        this.history.set([])
        this.setRoute(this.initialRoute)
    }
}
