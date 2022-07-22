<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton, Pane, Text } from 'shared/components'

    function handleMintNativeTokenClick() {
        openPopup({
            type: 'mintNativeTokenForm',
            overflow: true,
        })
    }
</script>

{#if $selectedAccount}
    <div
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-start"
    >
        {#key $selectedAccount?.id}
            <div class="w-full grid grid-cols-3 gap-x-4 min-h-0 min-w-0 max-w-7xl">
                <Pane classes="flex flex-col p-6 space-y-6">
                    <Text type="h5" classes="text-left">
                        {localize('general.nativeTokens')}
                    </Text>
                    <OnboardingButton
                        primaryText={localize('actions.mintNativeTokens')}
                        onClick={handleMintNativeTokenClick}
                    />
                </Pane>
            </div>
        {/key}
    </div>
{/if}
