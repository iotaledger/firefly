import { allAccountNfts } from '../stores'
import { INft } from '../interfaces'

export function setAccountNftsInAllAccountNfts(accountIndex: number, accountNfts: INft[]): void {
    allAccountNfts.update((state) => {
        state[accountIndex] = accountNfts
        return state
    })
}
