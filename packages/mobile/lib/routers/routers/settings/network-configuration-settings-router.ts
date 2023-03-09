import { get, writable, Writable } from 'svelte/store'
import { INetworkConfigurationSettingsRouterEvent } from '../../interfaces'

import { INode } from '@core/network'
import { Subrouter } from '@core/router'

import { NetworkConfigurationSettingsAction } from '@/contexts/settings'
import { settingsRouter } from '..'
import { NetworkConfigurationSettingsRoute } from '../../enums'

export const networkConfigurationSettingsRoute = writable<NetworkConfigurationSettingsRoute>(null)
export const networkConfigurationSettingsRouter = writable<NetworkConfigurationSettingsRouter>(null)

const selectedNodeStore = writable<INode>(undefined)

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
                        case NetworkConfigurationSettingsAction.UnsetAsPrimaryNode:
                            nextRoute = NetworkConfigurationSettingsRoute.UnsetAsPrimaryNodeConfirmation
                            break
                        case NetworkConfigurationSettingsAction.ExcludeNode:
                            nextRoute = NetworkConfigurationSettingsRoute.ExcludeNodeConfirmation
                            break
                        case NetworkConfigurationSettingsAction.DeleteNode:
                            nextRoute = NetworkConfigurationSettingsRoute.DeleteNodeConfirmation
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
        selectedNodeStore.set(undefined)
    }
}
