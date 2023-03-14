import { get } from 'svelte/store'
import { allAccountNfts } from '../stores'
import { downloadNftMedia } from '../actions/downloadNftMedia'

export function downloadAllNftMedia(): void {
    for (const [accountIndex, accountNfts] of get(allAccountNfts).entries()) {
        for (const nft of accountNfts) {
            void downloadNftMedia(nft, accountIndex)
        }
    }
}
