import { get, writable, Writable } from 'svelte/store'
import { INetworkConfigurationSettingsRouterEvent } from '../../interfaces'

import { INode } from '@core/network'
import { Subrouter } from '@core/router'

import { settingsRouter } from '..'
import { NetworkConfigurationSettingsRoute } from '../../enums'

export const networkConfigurationSettingsRoute = writable<NetworkConfigurationSettingsRoute>(null)
export const networkConfigurationSettingsRouter = writable<NetworkConfigurationSettingsRouter>(null)

const selectedNodeStore = writable<INode>(null)

export class NetworkConfigurationSettingsRouter extends Subrouter<NetworkConfigurationSettingsRoute> {
    constructor() {
        super(NetworkConfigurationSettingsRoute.Init, networkConfigurationSettingsRoute, get(settingsRouter))
    }
    next(event: INetworkConfigurationSettingsRouterEvent = {}): void {
        const { node } = event

        let nextRoute: NetworkConfigurationSettingsRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case NetworkConfigurationSettingsRoute.Init:
                if (node) {
                    selectedNodeStore.set(node)
                    nextRoute = NetworkConfigurationSettingsRoute.NodeDetails
                }
        }

        this.setNext(nextRoute)
    }
    getSelectedNodeStore(): Writable<INode> {
        return selectedNodeStore
    }
    reset(): void {
        super.reset()
        selectedNodeStore.set(null)
    }
}
