import type { INetworkFeatures } from '@lib/features/interfaces'

const networkFeatures: INetworkFeatures = {
    enabled: true,
    layer2: {
        enabled: true,
    },
    config: {
        enabled: true,
        addChain: {
            enabled: false,
        },
    },
}

export default networkFeatures
