import { ChainType, IChain, IIscpChainConfiguration, network } from '@core/network'
import features from '@features/features'
import { get } from 'svelte/store'
import { TokenStandard } from '../enums'
import { IAsset } from '../interfaces'

interface _ICompatibleNetwork {
    name: string
    networkAddress: string
}

export function getCompatibleAssetTransferNetworks(asset: IAsset): _ICompatibleNetwork[] {
    function _serializeChain(chain: IChain): _ICompatibleNetwork {
        const chainConfig = chain.getConfiguration() as IIscpChainConfiguration
        return {
            name: chainConfig.name,
            networkAddress: chainConfig.aliasAddress,
        }
    }

    const networkStore = get(network)
    const isAssetInLayer1 = asset.chainId === undefined || asset.chainId === null
    let compatibleNetworks: _ICompatibleNetwork[] = []

    if (networkStore) {
        // L1 network
        const layer1Network = {
            name: networkStore.getMetadata().name,
            networkAddress: '',
        }
        // L2 chains, ISCP only for now
        const iscpChains = features?.network?.layer2?.enabled
            ? networkStore.getChains().filter((chain) => chain.getConfiguration().type === ChainType.Iscp)
            : []
        const chainMatchingAssetChainId = iscpChains.find((chain) => chain.getConfiguration().chainId === asset.chainId)

        switch (asset.standard) {
            case TokenStandard.Irc27:
            case TokenStandard.Irc30:
            case TokenStandard.BaseToken:
                if (isAssetInLayer1) {
                    compatibleNetworks = [layer1Network, ...iscpChains.map((chain) => _serializeChain(chain))]
                } else {
                    compatibleNetworks.push(layer1Network)
                    if (chainMatchingAssetChainId) {
                        compatibleNetworks.push(_serializeChain(chainMatchingAssetChainId))
                    }
                }
                break
            case TokenStandard.Erc20:
                if (chainMatchingAssetChainId) {
                    if (chainMatchingAssetChainId) {
                        compatibleNetworks.push(_serializeChain(chainMatchingAssetChainId))
                    }
                }
                break
        }
    }
    return compatibleNetworks
}
