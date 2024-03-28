<script lang="ts">
    import {
        AllotManaButton,
        CreateAccountButton,
        FaucetRequestButton,
        MintNativeTokenButton,
        MintNftButton,
        RefreshTokenMetadataButton,
        TestDeepLinkButton,
    } from '@components'
    import { Pane, Text, TextType } from '@ui'

    import features from '@features/features'

    import { selectedWallet } from '@core/wallet/stores'
    import { localize } from '@core/i18n'
</script>

{#if $selectedWallet}
    <div
        class="w-full h-full flex flex-nowrap p-8 relative flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-start"
    >
        <div class="flex columns-3 gap-4 min-h-0 min-w-0 max-w-7xl">
            <Pane>
                <div class="flex flex-col space-y-6">
                    <Text type={TextType.h5} classes="text-left">
                        {localize('general.assets')}
                    </Text>
                    {#if features.developerTools.account.enabled}
                        <CreateAccountButton />
                    {/if}
                    {#if features.developerTools.mintNativeTokens.enabled}
                        <MintNativeTokenButton />
                    {/if}
                    {#if features.developerTools.mintNft.enabled}
                        <MintNftButton />
                    {/if}
                </div>
            </Pane>
            <Pane>
                <div class="flex flex-col space-y-6">
                    <Text type={TextType.h5} classes="text-left">
                        {localize('general.developerTools')}
                    </Text>
                    {#if features.developerTools.faucet.enabled}
                        <FaucetRequestButton />
                    {/if}
                    {#if features.developerTools.deeplink.enabled}
                        <TestDeepLinkButton />
                    {/if}
                    {#if features.developerTools.refreshTokens.enabled}
                        <RefreshTokenMetadataButton />
                    {/if}
                    {#if features.developerTools.allotMana.enabled}
                        <AllotManaButton />
                    {/if}
                </div>
            </Pane>
        </div>
    </div>
{/if}
