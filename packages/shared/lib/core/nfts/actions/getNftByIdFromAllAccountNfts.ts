import { allWalletNfts } from '../stores'
import { INft } from '../interfaces'
import { get } from 'svelte/store'

export function getNftByIdFromAllAccountNfts(walletId: string, nftId: string): INft | undefined {
    return get(allWalletNfts)[walletId]?.find((_nft) => _nft.id === nftId)
}
