import { get } from 'svelte/store'
import { NodePlugin } from '../enums'
import { networkStatus } from '../stores/network-status.store'

export function doesNodeHavePlugin(plugin: NodePlugin): boolean {
    return get(networkStatus).nodePlugins.includes(plugin)
}
