import { BASE_TOKEN } from '@core/network/constants'
import { activeProfile } from './active-profile.store'
import { derived } from 'svelte/store'

export const baseToken = derived([activeProfile], ([$activeProfile]) => BASE_TOKEN?.[$activeProfile?.networkProtocol])
