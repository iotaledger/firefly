import type { IWalletFeatures } from '@lib/features/interfaces'

const walletFeatures: IWalletFeatures = {
    enabled: true,
    accountSummary: {
        enabled: true,
    },
    sendAndReceive: {
        enabled: true,
        nft: {
            enabled: true,
        },
    },
    newSendFlow: {
        enabled: false,
    },
    assets: {
        enabled: true,
        burnAsset: {
            enabled: true,
        },
    },
    activityHistory: {
        enabled: true,
        sync: {
            enabled: true,
        },
        search: {
            enabled: true,
        },
    },
}

export default walletFeatures
