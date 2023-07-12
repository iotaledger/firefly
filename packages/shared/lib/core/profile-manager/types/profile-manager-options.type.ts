import { ClientOptions } from '@core/network/interfaces'
import { WalletOptions } from '@iota/wallet'

export type ProfileManagerOptions = Omit<WalletOptions, 'clientOptions'> & {
    clientOptions: ClientOptions
}
