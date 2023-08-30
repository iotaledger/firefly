import { ClientOptions } from '@core/network/interfaces'
import { WalletOptions } from '@iota/sdk/out/types'

export type ProfileManagerOptions = Omit<WalletOptions, 'clientOptions'> & {
    clientOptions: ClientOptions
}
