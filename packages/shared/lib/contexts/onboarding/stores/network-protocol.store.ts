import { NetworkProtocol } from '@core/network'
import { writable } from 'svelte/store'

/**
 * Selected network protocol during onboarding
 */
export const networkProtocol = writable<NetworkProtocol>(null)
