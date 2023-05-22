<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { ChainType, IIscpChainConfiguration, network } from '@core/network'
    import {
        NewTransactionType,
        formatTokenAmountBestMatch,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import features from '@features/features'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let networkAddress = $newTransactionDetails?.layer2Parameters?.networkAddress
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedIndex = -1

    const formattedAmount =
        $newTransactionDetails?.type === NewTransactionType.TokenTransfer
            ? formatTokenAmountBestMatch(
                  Number($newTransactionDetails?.rawAmount),
                  $newTransactionDetails.asset?.metadata
              )
            : undefined

    $: selectedOption = selectorOptions[selectedIndex]
    $: isLayer2 = !!networkAddress

    $: networkAddress = selectedOption?.networkAddress ?? $newTransactionDetails?.layer2Parameters?.networkAddress
    $: recipient = selectedOption?.recipient ?? $newTransactionDetails?.recipient

    onMount(() => {
        buildNetworkRecipientOptions()
    })

    function buildNetworkRecipientOptions(): void {
        if (!$network) {
            return
        }

        // L1 networks, hardcoded Shimmer
        const mainNetworkOption = {
            name: $network.getMetadata().name,
            networkAddress: '',
            recipient: undefined,
        }

        // L2 networks, ISCP only for now
        const iscpNetworkChains = features?.network?.layer2?.enabled
            ? $network.getChains().filter((chain) => chain.getConfiguration()?.type === ChainType.Iscp)
            : []
        const iscpNetworkChainsOptions = iscpNetworkChains.map((chain) => {
            const chainConfiguration = chain.getConfiguration() as IIscpChainConfiguration
            return {
                name: chainConfiguration.name,
                networkAddress: chainConfiguration?.aliasAddress,
                recipient: undefined,
            }
        })

        selectorOptions = [mainNetworkOption, ...iscpNetworkChainsOptions]
        selectedIndex =
            networkAddress && selectorOptions.length
                ? selectorOptions.findIndex((option) => option.networkAddress === networkAddress)
                : 0

        const recipient = $newTransactionDetails?.recipient
        if (recipient) {
            selectorOptions = selectorOptions.map((option, index) =>
                index === selectedIndex
                    ? {
                          ...option,
                          recipient,
                      }
                    : option
            )
        }
    }

    function onContinueClick(): void {
        const layer2Parameters = isLayer2
            ? { networkAddress: selectedOption?.networkAddress, senderAddress: $selectedAccount.depositAddress }
            : null
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

<SendFlowTemplate
    title={localize('popups.transaction.selectRecipient', {
        values: { amount: formattedAmount },
    })}
    leftButton={{ text: localize('actions.back'), onClick: onBackClick }}
    rightButton={{
        text: localize('actions.continue'),
        onClick: onContinueClick,
        disabled:
            networkAddress === undefined ||
            !recipient ||
            (recipient.type === 'address' && !recipient.address) ||
            (recipient.type === 'account' && !recipient.account),
    }}
>
    <NetworkRecipientSelector bind:options={selectorOptions} bind:selectedIndex />
</SendFlowTemplate>
