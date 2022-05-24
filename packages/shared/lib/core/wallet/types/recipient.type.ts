import { IAccountState } from '@core/account'

export type Recipient = { type: 'address'; address: string } | { type: 'account'; account: IAccountState }
