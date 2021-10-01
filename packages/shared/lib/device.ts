import { mobile } from 'shared/lib/app'
import { Electron } from 'shared/lib/electron'
import { get } from 'svelte/store'

export const openUrl = (url: string) => {
    if (get(mobile)) {
        console.log('Requested to open url: ', url)
    } else {
        Electron.openUrl(url)
    }
}