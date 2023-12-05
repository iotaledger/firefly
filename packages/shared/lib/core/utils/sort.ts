import { IWallet } from '@core/profile'

// TODO(2.0) Wallets do not have indexes anymore
export function sortAccountsByIndex(walletA: IWallet, walletB: IWallet): number {
    const index1 = walletA.getMetadata()?.index
    const index2 = walletB.getMetadata()?.index
    if (index1 < index2) {
        return -1
    } else if (index1 > index2) {
        return 1
    } else {
        return 0
    }
}
