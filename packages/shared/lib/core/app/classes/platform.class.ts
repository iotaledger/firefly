import { IPlatform } from '../interfaces'

// TODO: https://github.com/iotaledger/firefly/issues/5143
export const Platform: IPlatform = window['__ELECTRON__']
