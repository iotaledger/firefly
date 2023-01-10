import { get } from 'svelte/store'

import { IPlatform } from '../interfaces'
import { mobile } from '../stores'

mobile.set(process.env.PLATFORM === 'mobile')

// TODO: https://github.com/iotaledger/firefly/issues/5143
export const Platform: IPlatform = window[get(mobile) ? '__CAPACITOR__' : '__ELECTRON__']
