import { INftMetadata } from '..'

export interface IStoredNft {
    isUnspent: boolean
    nftMetadata: INftMetadata
}
