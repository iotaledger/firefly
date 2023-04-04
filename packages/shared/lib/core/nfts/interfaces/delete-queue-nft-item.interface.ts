import { INft } from './nft.interface'

export interface DeleteQueueNftItem {
    nft: INft
    path: string
    accountIndex: number
}
