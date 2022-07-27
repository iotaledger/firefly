import { get, Writable } from 'svelte/store'

import { backButtonStore } from './backbutton-history'
import { FireflyEvent } from './types'
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

        const prev = () => {
            this.previous(true)
        }

        get(backButtonStore).add(prev as () => Promise<void>)
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
    next(_?: FireflyEvent): void {
        throw Error('Unimplemented state machine within custom router!')
    }

    previous(isBackButton = false): void {
        const previousRoute = this.history.pop()
        if (isBackButton === false) {
            get(backButtonStore).remove()
        }
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
}
