<script lang="ts">
    import { selectedWallet } from '@core/wallet/stores'
    import { Height, Pane } from '@ui'
</script>

{#if $selectedWallet}
    <account-management-container
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 space-x-4 justify-center"
    >
        <div class="flex space-x-4 max-w-7xl justify-center w-full">
            {#key $selectedWallet?.id}
                <left-pane class="flex flex-col w-1/3">
                    <Pane height={Height.Full}>Account List</Pane>
                </left-pane>
                <right-pane class="w-full h-full min-h-96 flex-1 space-y-4 flex flex-col">
                    <Pane height={Height.Full}>Account Details</Pane>
                </right-pane>
            {/key}
        </div>
    </account-management-container>
{/if}
