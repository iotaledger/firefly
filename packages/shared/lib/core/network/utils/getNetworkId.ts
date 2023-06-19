import { get } from 'svelte/store'
import { NetworkId } from '../enums'
import { network } from '../stores'

export function getActiveNetworkId(): NetworkId | undefined {
    return get(network)?.getMetadata().id
}
