import { get, writable, Writable } from 'svelte/store'
import { INetworkConfigurationSettingsRouterEvent } from '../../interfaces'

import { INode } from '@core/network'
import { Subrouter } from '@core/router'

import { profileRouter } from '..'
import { NetworkConfigurationSettingsRoute } from '../../enums'

export const networkConfigurationSettingsRoute = writable<NetworkConfigurationSettingsRoute>(null)
export const networkConfigurationSettingsRouter = writable<NetworkConfigurationSettingsRouter>(null)

const selectedNodeStore = writable<INode>(null)

export class NetworkConfigurationSettingsRouter extends Subrouter<NetworkConfigurationSettingsRoute> {
    constructor() {
        super(NetworkConfigurationSettingsRoute.Init, networkConfigurationSettingsRoute, get(profileRouter))
    }
    next(event: INetworkConfigurationSettingsRouterEvent = {}): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { action, node } = event

        let nextRoute: NetworkConfigurationSettingsRoute
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const currentRoute = get(this.routeStore)

        this.setNext(nextRoute)
    }
    getSelectedNodeStore(): Writable<INode> {
        return selectedNodeStore
    }
    setSelectedNode(node: INode): void {
        selectedNodeStore.set(node)
    }
    reset(): void {
        super.reset()
        selectedNodeStore.set(null)
    }
}
