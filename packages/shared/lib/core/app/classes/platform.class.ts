import { IPlatform } from '../interfaces'
import { isMobile } from '../stores'

// TODO: https://github.com/iotaledger/firefly/issues/5143
export const Platform: IPlatform = window[isMobile && isMobile() ? '__CAPACITOR__' : '__ELECTRON__']
