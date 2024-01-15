<script lang="ts">
    import { selectedWallet } from '@core/wallet'
    import { ImplicitAccountCreationView, WalletView } from './views'

    const hasAccount: boolean = $selectedWallet.accountsOutput.length !== 0
</script>

{#if $selectedWallet}
    {#key $selectedWallet?.index}
        <wallet-container
            class="w-full h-full flex flex-nowrap p-8 relative flex-1
bg-gray-50 dark:bg-gray-900 justify-center items-center"
        >
            {#if hasAccount}
                <WalletView />
            {:else}
                <ImplicitAccountCreationView />
            {/if}
        </wallet-container>
    {/key}
{/if}
