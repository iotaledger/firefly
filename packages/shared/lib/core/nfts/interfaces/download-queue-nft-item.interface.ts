import { INft } from './nft.interface'

export interface DownloadQueueNftItem {
    nft: INft
    downloadUrl: string
    path: string
    accountIndex: number
}
