import { updateClientOptions } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'

export async function toggleLocalPowInClientOptions(): Promise<void> {
    const clientOptions = get(activeProfile)?.clientOptions
    await updateClientOptions({ localPow: !clientOptions?.localPow })
}
