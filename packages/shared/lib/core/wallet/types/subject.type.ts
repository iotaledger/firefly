import { IAccountState } from '@core/account'

export type Subject = { type: 'address'; address: string } | { type: 'account'; account: IAccountState }
