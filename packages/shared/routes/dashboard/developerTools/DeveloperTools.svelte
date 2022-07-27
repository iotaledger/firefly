<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import {
        FaucetRequestButton,
        MintNativeTokenButton,
        Pane,
        RefreshTokenMetadataButton,
        Text,
    } from 'shared/components'
</script>

{#if $selectedAccount}
    <div
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-start"
    >
        {#key $selectedAccount?.id}
            <div class="w-full grid grid-cols-3 gap-4 min-h-0 min-w-0 max-w-7xl">
                <Pane classes="flex flex-col p-6 space-y-6">
                    <Text type="h5" classes="text-left">
                        {localize('general.assets')}
                    </Text>
                    <FaucetRequestButton />
                    <MintNativeTokenButton />
                    <RefreshTokenMetadataButton />
                </Pane>
            </div>
        {/key}
    </div>
{/if}
