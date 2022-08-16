import { IAccount } from '@core/account'

export function sortAccountByIndex(account1: IAccount, account2: IAccount): number {
    if (account1?.meta?.index < account2?.meta?.index) {
        return -1
    } else if (account1?.meta?.index > account2?.meta?.index) {
        return 1
    } else {
        return 0
    }
}
