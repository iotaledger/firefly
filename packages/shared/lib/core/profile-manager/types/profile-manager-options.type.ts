import { ClientOptions } from '@core/network/interfaces'
import { AccountManagerOptions } from '@iota/wallet'

export type ProfileManagerOptions = Omit<AccountManagerOptions, 'clientOptions'> & {
    clientOptions: ClientOptions
}
