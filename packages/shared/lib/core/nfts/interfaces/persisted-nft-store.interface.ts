import { IPersistedNftData } from './persisted-nft-data.interface'

export interface IPersistedNftStore {
    [profileId: string]: {
        [nftId: string]: IPersistedNftData
    }
}
