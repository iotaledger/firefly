import { Readable, derived, get } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { StardustNetwork } from '../classes'
import { INetwork } from '../interfaces'

export const network: Readable<INetwork | undefined> = derived([activeProfile], ([$activeProfile]) => {
    if ($activeProfile) {
        return new StardustNetwork($activeProfile.network, $activeProfile.network.chainConfigurations)
    } else {
        return undefined
    }
})

export function getNetwork(): INetwork | undefined {
    return get(network)
}
