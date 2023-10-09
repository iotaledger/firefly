import { get } from 'svelte/store'
import { profileManager } from '../stores'

export async function clearStrongholdPassword(): Promise<void> {
    const manager = get(profileManager)
    // TODO: Find the root cause that makes the profileManager be `null` https://github.com/iotaledger/firefly/issues/7456
    await manager?.clearStrongholdPassword()
}
