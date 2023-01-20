import { get, writable, Writable } from 'svelte/store'
import { INetworkConfigurationSettingsRouterEvent } from '../../interfaces'

import { INode } from '@core/network'
import { Subrouter } from '@core/router'

import { settingsRouter } from '..'
import { NetworkConfigurationSettingsAction } from '../../../contexts/settings'
import { NetworkConfigurationSettingsRoute } from '../../enums'

export const networkConfigurationSettingsRoute = writable<NetworkConfigurationSettingsRoute>(null)
export const networkConfigurationSettingsRouter = writable<NetworkConfigurationSettingsRouter>(null)

const selectedNodeStore = writable<INode>(undefined)
const unsubscribeRouteObserver = networkConfigurationSettingsRoute.subscribe((route) => {
    if (route === NetworkConfigurationSettingsRoute.Init) {
        selectedNodeStore.set(undefined)
    }
})

export class NetworkConfigurationSettingsRouter extends Subrouter<NetworkConfigurationSettingsRoute> {
    constructor() {
        super(NetworkConfigurationSettingsRoute.Init, networkConfigurationSettingsRoute, get(settingsRouter))
    }
    next(event: INetworkConfigurationSettingsRouterEvent = {}): void {
        const { node, action } = event

        let nextRoute: NetworkConfigurationSettingsRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case NetworkConfigurationSettingsRoute.Init:
                if (node) {
                    selectedNodeStore.set(node)
                    nextRoute = NetworkConfigurationSettingsRoute.NodeDetails
                } else if (action) {
                    switch (action) {
                        case NetworkConfigurationSettingsAction.AddNode:
                            nextRoute = NetworkConfigurationSettingsRoute.AddNode
                            break
                    }
                }
                break
            case NetworkConfigurationSettingsRoute.NodeDetails:
                if (action) {
                    switch (action) {
                        case NetworkConfigurationSettingsAction.EditNode:
                            nextRoute = NetworkConfigurationSettingsRoute.EditNode
                            break
                    }
                }
                break
        }

        this.setNext(nextRoute)
    }
    getSelectedNodeStore(): Writable<INode> {
        return selectedNodeStore
    }
    reset(): void {
        super.reset()
        unsubscribeRouteObserver()
        selectedNodeStore.set(undefined)
    }
}
