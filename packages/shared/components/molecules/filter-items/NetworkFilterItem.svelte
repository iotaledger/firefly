<script lang="ts">
    import { Dropdown } from 'shared/components'
    import type { IDropdownItem } from '@core/utils'
    import { visibleSelectedAccountAssets } from '@core/wallet'
    import { NetworkFilterUnit } from '@core/utils/interfaces/filter'
    import { activeProfile } from '@core/profile'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { ChainType, IChain, IIscpChainConfiguration, network } from '@core/network'
    import {
        IAsset,
        NewTokenTransactionDetails,
        NewTransactionType,
        TokenStandard,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { closePopup } from '@desktop/auxiliary/popup'
    import features from '@features/features'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    export let filterUnit: NetworkFilterUnit

    let choices: IDropdownItem<string>[] = []

    function buildOptions(): IDropdownItem<string>[] {
        if (!$network) {
            return []
        }
        // L1 network
        const layer1Network = {
            label: $network.getMetadata().name,
            value: $network.getMetadata().name,
        }
        // L2 chains, ISCP only for now
        const iscpChains = features?.network?.layer2?.enabled
            ? $network.getChains().filter((chain) => chain.getConfiguration().type === ChainType.Iscp)
            : []
        const iscpChainsOptions = iscpChains.map((chain) => ({
            label: chain.getConfiguration().name,
            value: chain.getConfiguration().name,
        }))
        return [layer1Network, ...iscpChainsOptions]
    }

    const { baseCoin, nativeTokens } = $visibleSelectedAccountAssets[$activeProfile?.network?.id]

    const choices: IDropdownItem<string>[] = [baseCoin, ...nativeTokens].map((choice) => ({
        label: choice.metadata.name,
        value: choice.metadata.name,
    }))

    if (!filterUnit.selected) {
        filterUnit.selected = baseCoin.id
    }

    let value: string
    $: {
        const assetId = filterUnit.selected
        if (assetId === baseCoin.id) {
            value = baseCoin?.metadata.name
        } else {
            value = nativeTokens.find((_nativeToken) => _nativeToken.id === assetId)?.metadata?.name
        }
    }

    function onSelect(item: IDropdownItem<string>): void {
        let asset = undefined
        if (item.value === baseCoin.metadata.name) {
            asset = baseCoin
        } else {
            asset = nativeTokens.find((_nativeToken) => _nativeToken.metadata?.name === item.value)
        }
        filterUnit.selected = asset?.id || ''
    }
</script>

<Dropdown {value} items={choices} {onSelect} small />
