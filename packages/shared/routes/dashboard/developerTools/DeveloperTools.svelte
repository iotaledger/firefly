<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton, Pane, Text } from 'shared/components'

    function handleGetTokenClick() {
        openPopup({
            type: 'faucetRequest',
        })
    }

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
            <div class="w-full grid grid-cols-3 gap-4 min-h-0 min-w-0 max-w-7xl">
                <Pane classes="flex flex-col p-6 space-y-6">
                    <Text type="h5" classes="text-left">
                        {localize('general.assets')}
                    </Text>
                    <OnboardingButton
                        primaryText={localize('actions.faucetRequest', {
                            values: { token: $nodeInfo?.baseToken?.name },
                        })}
                        secondaryText={localize('general.faucetRequestDescription', {
                            values: { network: $nodeInfo?.protocol?.networkName },
                        })}
                        onClick={handleGetTokenClick}
                    />
                    <OnboardingButton
                        primaryText={localize('actions.mintNativeToken')}
                        secondaryText={localize('general.mintNativeTokenDescription')}
                        onClick={handleMintNativeTokenClick}
                    />
                </Pane>
            </div>
        {/key}
    </div>
{/if}
