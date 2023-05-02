<script lang="ts">
    import { localize } from '@core/i18n'
    import { Button, FontWeight, Text, TextType, NetworkInput, RecipientInput } from '@ui'
    import { sendFlowRouter } from '../send-flow-router'
    import { isLayer1Destination } from '@core/layer-2'
    import { newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { selectedAccount } from '@core/account/stores'
    import features from '@features/features'
    import { get } from 'svelte/store'

    let networkInput: NetworkInput
    let recipientInput: RecipientInput
    let { type, recipient, layer2Parameters } = get(newTransactionDetails)
    let networkAddress = layer2Parameters?.networkAddress

    $: isLayer2 = !isLayer1Destination(networkAddress)

    function onContinueClick(): void {
        layer2Parameters = isLayer2 ? { networkAddress, senderAddress: $selectedAccount.depositAddress } : null
        updateNewTransactionDetails({ type, recipient, layer2Parameters })
        $sendFlowRouter.next()
    }

    function onBackClick(): void {
        updateNewTransactionDetails({ type, recipient: undefined, layer2Parameters: undefined })
        $sendFlowRouter.previous()
    }
</script>

<input-destination-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <input-destination-title>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">Input Destination Title</Text>
    </input-destination-title>
    <input-destination-content class="flex flex-col space-y-4">
        <NetworkInput bind:this={networkInput} bind:networkAddress showLayer2={features?.network?.layer2?.enabled} />
        <RecipientInput bind:this={recipientInput} bind:recipient {isLayer2} />
    </input-destination-content>
    <input-destination-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </input-destination-buttons>
</input-destination-view>
