import { get } from 'svelte/store'

import { IPlatform } from '../interfaces'
import { mobile } from '../stores'
import { PlatformExtension } from '../types'

const IS_MOBILE = get(mobile)

// TODO: https://github.com/iotaledger/firefly/issues/5143
export let Platform: IPlatform = window[IS_MOBILE ? '__CAPACITOR__' : '__ELECTRON__']

export function extendPlatform(extensions: PlatformExtension[]): void {
    const extensionBoundObject = Object.fromEntries(extensions)
    Platform = {
        /**
         * CAUTION: The order of the spread operations ensures that important
         * methods cannot be overridden.
         */
        ...extensionBoundObject,
        ...Platform,
    }
}
