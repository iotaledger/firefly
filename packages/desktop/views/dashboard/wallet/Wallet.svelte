<script lang="ts">
    import { hasBlockIssuerFeature, selectedWallet } from '@core/wallet'
    import { ImplicitAccountCreationView, WalletView } from './views'
    import { AccountOutput } from '@iota/sdk/out/types'

    $: showImplicitAccountFlow =
        !$selectedWallet?.accountOutputs?.length ||
        !$selectedWallet.accountOutputs.some((account) => hasBlockIssuerFeature(account.output as AccountOutput))
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
