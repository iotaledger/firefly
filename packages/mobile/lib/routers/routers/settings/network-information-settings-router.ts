import { get, writable, Writable } from 'svelte/store'
import { INetworkInformationSettingsRouterEvent } from '../../interfaces'

import { INode } from '@core/network'
import { Subrouter } from '@core/router'

import { NetworkInformationSettingsAction } from '@/contexts/settings'
import { settingsRouter } from '..'
import { NetworkInformationSettingsRoute } from '../../enums'

export const networkInformationSettingsRoute = writable<NetworkInformationSettingsRoute>(null)
export const networkInformationSettingsRouter = writable<NetworkInformationSettingsRouter>(null)

const selectedNodeStore = writable<INode>(undefined)

export class NetworkInformationSettingsRouter extends Subrouter<NetworkInformationSettingsRoute> {
    constructor() {
        super(NetworkInformationSettingsRoute.Init, networkInformationSettingsRoute, get(settingsRouter))
    }
    next(event: INetworkInformationSettingsRouterEvent = {}): void {
        const { node, action } = event

        let nextRoute: NetworkInformationSettingsRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case NetworkInformationSettingsRoute.Init:
                if (node) {
                    selectedNodeStore.set(node)
                    nextRoute = NetworkInformationSettingsRoute.NodeDetails
                } else if (action) {
                    switch (action) {
                        case NetworkInformationSettingsAction.AddNode:
                            nextRoute = NetworkInformationSettingsRoute.AddNode
                            break
                    }
                }
                break
            case NetworkInformationSettingsRoute.NodeDetails:
                if (action) {
                    switch (action) {
                        case NetworkInformationSettingsAction.EditNode:
                            nextRoute = NetworkInformationSettingsRoute.EditNode
                            break
                        case NetworkInformationSettingsAction.UnsetAsPrimaryNode:
                            nextRoute = NetworkInformationSettingsRoute.UnsetAsPrimaryNodeConfirmation
                            break
                        case NetworkInformationSettingsAction.ExcludeNode:
                            nextRoute = NetworkInformationSettingsRoute.ExcludeNodeConfirmation
                            break
                        case NetworkInformationSettingsAction.DeleteNode:
                            nextRoute = NetworkInformationSettingsRoute.DeleteNodeConfirmation
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
