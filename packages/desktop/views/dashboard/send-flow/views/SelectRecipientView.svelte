<script lang="ts">
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { network } from '@core/network'
    import {
        NewTokenTransactionDetails,
        NewTransactionType,
        newTransactionDetails,
        updateNewTransactionDetails,
    } from '@core/wallet'
    import { getCompatibleAssetTransferNetworks } from '@core/wallet/utils'
    import { closePopup } from '@desktop/auxiliary/popup'
    import { INetworkRecipientSelectorOption, NetworkRecipientSelector } from '@ui'
    import { onMount } from 'svelte'
    import { sendFlowRouter } from '../send-flow.router'
    import SendFlowTemplate from './SendFlowTemplate.svelte'

    let networkAddress = $newTransactionDetails?.layer2Parameters?.networkAddress
    let selectorOptions: INetworkRecipientSelectorOption[] = []
    let selectedIndex = -1

    const disableAssetSelection = $newTransactionDetails.disableAssetSelection
    const assetName =
        $newTransactionDetails?.type === NewTransactionType.TokenTransfer
            ? $newTransactionDetails.asset?.metadata.name
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

        const asset = ($newTransactionDetails as NewTokenTransactionDetails).asset
        selectorOptions = getCompatibleAssetTransferNetworks(asset)
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
        if (disableAssetSelection) {
            closePopup()
        } else {
            $sendFlowRouter.previous()
        }
    }
</script>

<SendFlowTemplate
    title={localize('popups.transaction.selectRecipient', {
        values: { assetName },
    })}
    leftButton={{ text: localize(disableAssetSelection ? 'actions.cancel' : 'actions.back'), onClick: onBackClick }}
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
