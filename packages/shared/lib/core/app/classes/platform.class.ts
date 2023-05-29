import { IPlatform } from '../interfaces'
import { isMobile } from '../stores'

// TODO: https://github.com/iotaledger/firefly/issues/5143
export const Platform: IPlatform = window[isMobile() ? '__CAPACITOR__' : '__ELECTRON__']
