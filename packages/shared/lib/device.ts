import { mobile } from 'shared/lib/app'
import { Electron } from 'shared/lib/electron'
import { get } from 'svelte/store'

export const openUrl = (url: string): void => {
    if (get(mobile)) {
        // TODO: implement
    } else {
        Electron.openUrl(url)
    }
}
