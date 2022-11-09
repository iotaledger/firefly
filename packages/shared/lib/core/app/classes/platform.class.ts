import { get } from 'svelte/store'

import { IPlatform } from '../interfaces'
import { mobile } from '../stores'

const IS_MOBILE = get(mobile)

// TODO: https://github.com/iotaledger/firefly/issues/5143
export let Platform: IPlatform = window[IS_MOBILE ? '__CAPACITOR__' : '__ELECTRON__']

export function extendPlatform(methodName: string, method: () => unknown): void {
    Platform = {
        ...Platform,
        [methodName]: method,
    }
}
