import { IAccount } from '@core/account'

export function sortAccountsByIndex(account1: IAccount, account2: IAccount): number {
    const index1 = account1.getMetadata()?.index
    const index2 = account2.getMetadata()?.index
    if (index1 < index2) {
        return -1
    } else if (index1 > index2) {
        return 1
    } else {
        return 0
    }
}
