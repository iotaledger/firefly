<script lang="typescript">
    import { AmountInput, Button, UnitInput } from '@ui'
    import { onMount } from 'svelte'

    import { newTransactionDetails, NewTransactionType, updateNewTransactionDetails } from '@core/wallet'
    import { sendRouter } from '../../../../../lib/routers'

    let amount =
        $newTransactionDetails?.type === NewTransactionType.TokenTransfer
            ? $newTransactionDetails?.rawAmount
            : undefined
    let unit: string =
        $newTransactionDetails?.type === NewTransactionType.TokenTransfer ? $newTransactionDetails?.unit : undefined
    const error = ''

    let amountInputElement: HTMLInputElement

    // $: amount, validate()
    onMount(() => {
        // if SMR we show the toggle SMR/Glow, otherwise we show nothing
        // updateNewTransactionDetails({
        //     type: $newTransactionDetails.type,
        //     unit: $newTransactionDetails?.unit ?? IotaUnit.M,
        // })
    })

    function onContinueClick(): void {
        updateNewTransactionDetails({
            type: $newTransactionDetails.type,
            rawAmount: amount,
            unit,
        })
        $sendRouter.next()
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1">
    <div class="flex flex-row">
        <!-- <input type="number" bind:value={amount} /> -->
        <AmountInput bind:inputElement={amountInputElement} bind:amount maxDecimals={false} isInteger={true} />
        <!-- {#if condition}
        {/if} -->
        <UnitInput
            bind:unit
            tokenMetadata={$newTransactionDetails?.type === NewTransactionType.TokenTransfer
                ? $newTransactionDetails.asset?.metadata
                : undefined}
            isFocused={false}
        />
    </div>
    <Button onClick={onContinueClick} disabled={false} classes="w-full">
        {error ? error : 'continue'}
    </Button>
</div>
