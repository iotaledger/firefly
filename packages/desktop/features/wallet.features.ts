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
        enabled: true,
        sync: {
            enabled: true,
        },
        search: {
            enabled: true,
        },
    },
    multiWallet: {
        // TODO: update when multiwallet is implemented -> https://github.com/iotaledger/firefly/issues/8362
        enabled: false,
    },
}

export default walletFeatures
