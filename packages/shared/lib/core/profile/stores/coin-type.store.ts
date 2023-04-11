import { COIN_TYPE } from '@core/network/constants'
import { activeProfile } from './active-profile.store'
import { derived } from 'svelte/store'

export const coinType = derived([activeProfile], ([$activeProfile]) => COIN_TYPE[$activeProfile.networkProtocol])
