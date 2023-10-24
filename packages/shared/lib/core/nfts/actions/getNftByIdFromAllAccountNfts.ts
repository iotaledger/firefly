import { allAccountNfts } from '../stores'
import { INft } from '../interfaces'
import { get } from 'svelte/store'

export function getNftByIdFromAllAccountNfts(accountIndex: number, nftId: string): INft | undefined {
    return get(allAccountNfts)[accountIndex]?.find((_nft) => _nft.id === nftId)
}
