import { IAccountState } from '@core/account'

export type Sender = { type: 'address'; address: string } | { type: 'account'; account: IAccountState }
