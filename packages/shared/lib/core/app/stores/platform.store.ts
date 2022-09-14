import { Writable, writable } from 'svelte/store'
import { PlatformOption } from '../enums'

export const platform: Writable<PlatformOption> = writable(null)

export function setPlatform(platformStr: string): void {
    platform.set(Object.values(PlatformOption).find((p) => p === platformStr))
}
