<script lang="typescript">
    import { onMount } from 'svelte'

    import { selectedAccountAssets, newTransactionDetails, updateNewTransactionDetails } from '@core/wallet'
    import { sendRouter } from '../../../../../lib/routers'

    let amount = ''
    // let unit
    const error = ''

    // $: unit,
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
            unit: $selectedAccountAssets.baseCoin.metadata.unit,
        })
        $sendRouter.next()
    }
</script>

<div class="w-full overflow-y-auto flex flex-auto h-1">
    <input type="number" bind:value={amount} />
    <!-- {#if condition}
    {/if} -->
    <button on:click={onContinueClick}>{error ?? 'continue'}</button>
</div>
