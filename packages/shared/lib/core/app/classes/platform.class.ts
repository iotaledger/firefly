import { IPlatform } from '../interfaces'

const IS_MOBILE = process.env.PLATFORM === 'mobile'

// TODO: https://github.com/iotaledger/firefly/issues/5143
export const Platform: IPlatform = window[IS_MOBILE ? '__CAPACITOR__' : '__ELECTRON__']
