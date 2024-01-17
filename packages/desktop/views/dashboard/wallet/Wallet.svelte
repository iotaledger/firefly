<script lang="ts">
    import { selectedWallet } from '@core/wallet'
    import { ImplicitAccountCreationView, WalletView } from './views'

    $: hasAccount = $selectedWallet.accountOutputs.length !== 0
</script>

{#if $selectedWallet}
    {#key $selectedWallet?.index}
        {#if hasAccount}
            <WalletView />
        {:else}
            <ImplicitAccountCreationView />
        {/if}
    {/key}
{/if}
