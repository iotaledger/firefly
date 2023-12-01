import { allWalletNfts } from '../stores'
import { INft } from '../interfaces'

export function setAccountNftsInAllAccountNfts(accountIndex: number, accountNfts: INft[]): void {
    allWalletNfts.update((state) => {
        state[accountIndex] = accountNfts
        return state
    })
}
