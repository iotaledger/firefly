import { DEFAULT_MARKET_CURRENCY } from '@core/market'
import { ProfileType } from '../enums'
import { IPersistedProfile } from '../interfaces'
import { DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES } from './default_stronghold_password_timeout_in_minutes.constant'
import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS, DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES } from '@core/nfts/constants'
import { IPersistedNetwork } from '../../network'
import { SecretManagerType } from '@iota/sdk'

export const DEFAULT_PERSISTED_PROFILE_OBJECT: IPersistedProfile = {
    id: '',
    name: '',
    type: ProfileType.Software,
    network: undefined as unknown as IPersistedNetwork,
    lastStrongholdBackupTime: undefined as unknown as Date,
    settings: {
        marketCurrency: DEFAULT_MARKET_CURRENCY,
        lockScreenTimeoutInMinutes: 5,
        strongholdPasswordTimeoutInMinutes: DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES,
        maxMediaSizeInMegaBytes: DEFAULT_MAX_NFT_SIZE_IN_MEGABYTES,
        maxMediaDownloadTimeInSeconds: DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS,
        hideNetworkStatistics: true,
    },
    walletPersistedData: {},
    isDeveloperProfile: false,
    forceAssetRefresh: false,
    strongholdVersion: undefined,
    clientOptions: {},
    secretManagerOptions: undefined as unknown as SecretManagerType,
}
