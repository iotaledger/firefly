import { ILayer2AccountBalance } from './layer2-account-balance.interface'

export interface ILayer2ProfileBalances {
    [accountIndex: number]: ILayer2AccountBalance | undefined
}
