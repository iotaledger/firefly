import { Readable, derived } from 'svelte/store'

import { activeProfile } from '@core/profile/stores'

import { StardustNetwork } from '../classes'
import { INetwork } from '../interfaces'

export const network: Readable<INetwork> = derived([activeProfile], ([$activeProfile]) => {
    if ($activeProfile) {
        return new StardustNetwork($activeProfile.network, $activeProfile.network.chains)
    } else {
        return undefined
    }
})
