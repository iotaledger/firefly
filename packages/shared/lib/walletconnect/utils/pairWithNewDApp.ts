import { get } from 'svelte/store'
import { walletClient } from '../stores'

export async function pairWithNewApp(uri: string): Promise<void> {
    const client = get(walletClient)
    if (!client) {
        return
    }

    try {
        await client.core.pairing.pair({ uri })
    } catch (e) {
        console.error('already connected')
    }
}
