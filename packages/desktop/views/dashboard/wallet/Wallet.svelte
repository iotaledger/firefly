<script lang="ts">
    import { hasBlockIssuerFeature, selectedWallet } from '@core/wallet'
    import { ImplicitAccountCreationView, WalletView } from './views'
    import { AccountOutput } from '@iota/sdk/out/types'

    $: showImplicitAccountFlow =
        !$selectedWallet?.accountOutputs?.length ||
        !$selectedWallet.accountOutputs.some((account) => hasBlockIssuerFeature(account.output as AccountOutput))

    // Note: ugly patch
    // We can asume that the first account is the implicit account, otherwise the user would be in a different flow
    $: uniqueImplicitAccountOutput = $selectedWallet?.implicitAccountOutputs?.[0]?.outputId
</script>

{#if $selectedWallet}
    {#key $selectedWallet?.id}
        {#if showImplicitAccountFlow}
            <div class="flex flex-col w-full h-full pt-5 px-60 pb-12 items-center justify-between">
                <ImplicitAccountCreationView outputId={uniqueImplicitAccountOutput} isWizard={true} />
            </div>
        {:else}
            <WalletView />
        {/if}
    {/key}
{/if}
