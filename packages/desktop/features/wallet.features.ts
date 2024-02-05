import { IWalletFeatures } from '@lib/features/interfaces'

const walletFeatures: IWalletFeatures = {
    enabled: true,
    walletSummary: {
        enabled: true,
    },
    sendAndReceive: {
        enabled: true,
        nft: {
            enabled: true,
        },
    },
    assets: {
        enabled: true,
        burnAsset: {
            enabled: true,
        },
    },
    activityHistory: {
        enabled: false,
        sync: {
            enabled: false,
        },
        search: {
            enabled: false,
        },
    },
}

export default walletFeatures
