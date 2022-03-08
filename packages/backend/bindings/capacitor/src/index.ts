import { registerPlugin } from '@capacitor/core'

import { WalletPluginTypes } from './definitions'

const WalletPlugin = registerPlugin<WalletPluginTypes>('WalletPlugin')

export * from './definitions'
export { WalletPlugin }
