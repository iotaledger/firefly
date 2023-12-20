import { allWalletNfts } from '../stores'
import { INft } from '../interfaces'

export function setWalletNftsInAllWalletNfts(walletId: string, walletNfts: INft[]): void {
    allWalletNfts.update((state) => {
        state[walletId] = walletNfts
        return state
    })
}
