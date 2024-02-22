<script lang="ts">
    import { selectedWallet } from '@core/wallet'
    import { ImplicitAccountCreationView, WalletView } from './views'

    // TODO: replace 3 with 1 when the faucet is fixed
    // https://github.com/iotaledger/inx-faucet/issues/122
    $: showImplicitAccountFlow =
        !$selectedWallet?.accountOutputs?.length && $selectedWallet?.implicitAccountOutputs?.length <= 3
</script>

{#if $selectedWallet}
    {#key $selectedWallet?.id}
        {#if showImplicitAccountFlow}
            <div class="flex flex-col w-full h-full pt-5 px-60 pb-12 items-center justify-between">
                <ImplicitAccountCreationView outputId={undefined} />
            </div>
        {:else}
            <WalletView />
        {/if}
    {/key}
{/if}
