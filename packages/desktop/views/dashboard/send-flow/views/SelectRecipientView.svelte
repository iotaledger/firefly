<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import type { ILayer2Parameters } from '@core/layer-2'
    import { NETWORK_ADDRESS, isLayer1Destination } from '@core/layer-2'
    import { ChainType, IIscpChainConfiguration, network } from '@core/network'
    import { activeProfile } from '@core/profile'
    import {
        NewTransactionType,
        Subject,
        formatTokenAmountBestMatch,
        getAssetFromPersistedAssets,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import features from '@features/features'
    import { Button, FontWeight, INetworkRecipientSelectorOption, NetworkRecipientSelector, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'

    let layer2Parameters: ILayer2Parameters
    let recipient: Subject = $newTransactionDetails?.recipient
    let networkAddress = $newTransactionDetails?.layer2Parameters?.networkAddress
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedOption: INetworkRecipientSelectorOption = undefined

    const rawAmount =
        $newTransactionDetails?.type === NewTransactionType.TokenTransfer
            ? Number($newTransactionDetails?.rawAmount)
            : undefined
    const formattedAmount =
        $newTransactionDetails?.type === NewTransactionType.TokenTransfer
            ? formatTokenAmountBestMatch(
                  Number(rawAmount),
                  getAssetFromPersistedAssets($newTransactionDetails?.assetId)?.metadata
              )
            : undefined

    $: isLayer2 = !isLayer1Destination(networkAddress)
    $: networkAddress = selectedOption?.networkAddress ?? $newTransactionDetails?.layer2Parameters?.networkAddress
    $: recipient = selectedOption?.recipient ?? $newTransactionDetails?.recipient

    onMount(() => {
        buildNetworkRecipientOptions()
        if (recipient) {
            const _selectedOption = networkAddress
                ? selectorOptions?.find((option) => option.networkAddress === networkAddress)
                : selectorOptions[0]
            if (_selectedOption) {
                selectedOption = _selectedOption
                selectorOptions = selectorOptions.map((option) => {
                    if (option.id === selectedOption?.id) {
                        return {
                            ...option,
                            recipient,
                        }
                    }
                    return option
                })
            }
        }
    })

    function buildNetworkRecipientOptions(): void {
        // L1 networks, hardcoded Shimmer
        const activeProfileNetworkAddresses = NETWORK_ADDRESS[$activeProfile?.network?.id]
        const name = $network.getMetadata().name
        const networkAddress = activeProfileNetworkAddresses?.Shimmer
        selectorOptions.push({
            id: 0,
            name,
            networkAddress,
            recipient: undefined,
        })
        // L2 networks, ISCP only for now
        const iscpNetworkChains = features?.network?.layer2?.enabled
            ? $network.getChains()?.filter((chain) => chain?.getConfiguration()?.type === ChainType.Iscp)
            : []
        iscpNetworkChains.forEach((chain, index) => {
            const chainConfiguration = chain.getConfiguration() as IIscpChainConfiguration
            const name = chainConfiguration.name
            const networkAddress = chainConfiguration?.aliasAddress
            selectorOptions.push({
                id: index + 1,
                name,
                networkAddress,
                recipient: undefined,
            })
        })
        // needed for reactivity
        selectorOptions = selectorOptions
    }

    function onContinueClick(): void {
        networkAddress = selectedOption?.networkAddress
        recipient = selectedOption?.recipient
        layer2Parameters = isLayer2 ? { networkAddress, senderAddress: $selectedAccount.depositAddress } : null
        updateNewTransactionDetails({
            type: $newTransactionDetails?.type,
            recipient,
            layer2Parameters,
        })
        $sendFlowRouter.next()
    }

    function onBackClick(): void {
        updateNewTransactionDetails({
            type: $newTransactionDetails?.type,
            recipient: undefined,
            layer2Parameters: undefined,
        })
        $sendFlowRouter.previous()
    }
</script>

<select-recipient-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <select-recipient-title>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
            {localize('popups.transaction.selectRecipient', {
                values: { amount: formattedAmount },
            })}
        </Text>
    </select-recipient-title>
    <select-recipient-content>
        <NetworkRecipientSelector bind:options={selectorOptions} bind:selected={selectedOption} />
    </select-recipient-content>
    <select-recipient-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button
            classes="w-full"
            onClick={onContinueClick}
            disabled={!networkAddress ||
                !recipient ||
                (recipient?.type === 'address' && !recipient?.address) ||
                (recipient?.type === 'account' && !recipient?.account)}
        >
            {localize('actions.continue')}
        </Button>
    </select-recipient-buttons>
</select-recipient-view>
