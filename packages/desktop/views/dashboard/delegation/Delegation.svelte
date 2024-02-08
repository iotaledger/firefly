<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import { Height, Pane } from '@ui'
</script>

{#if $selectedWallet}
    <delegation-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        {#key $selectedWallet?.id}
            <Pane height={Height.Full}>Delegation</Pane>
        {/key}
    </delegation-container>
{/if}
