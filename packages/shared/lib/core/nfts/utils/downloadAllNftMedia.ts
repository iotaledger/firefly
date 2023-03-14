import { get } from 'svelte/store'
import { allAccountNfts } from '../stores'
import { downloadNftMedia } from '../actions/downloadNftMedia'

export async function downloadAllNftMedia(): Promise<void> {
    for (const [accountIndex, accountNfts] of get(allAccountNfts).entries()) {
        for (const nft of accountNfts) {
            await downloadNftMedia(nft, accountIndex)
        }
    }
}
