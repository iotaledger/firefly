<script lang="ts">
    import { Button, Text, TextType, TextHint } from 'shared/components'
    import { TextHintVariant } from 'shared/components/enums'
    import { getEnabledNetworkFromFeatureFlags } from '@core/network'

    const NETWORK_ID = getEnabledNetworkFromFeatureFlags()

    function onLinkClick(): void {
        window.open('https://chrome.google.com/webstore/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija', '_blank')
    }
</script>

{#if NETWORK_ID === [NetworkId.Shimmer] || NETWORK_ID === [NetworkId.ShimmerTestnet]}
    <Text type={TextType.h5} classes="mb-5">Shimmer is no longer maintained</Text>
    <div class="flex w-full flex-col space-y-6">
        <div class="flex w-full flex-col space-y-4">
            <TextHint
                variant={TextHintVariant.Info}
                text="Firefly Shimmer is no longer maintained or receiving updates"
            />
            <Text fontSize="15"
                >Firefly Shimmer is no longer actively maintained by the IOTA Foundation. Please use it at your own
                risk, as future issues or vulnerabilities may not be addressed.</Text
            >
        </div>
    </div>
{:else}
    <Text type={TextType.h5} classes="mb-5">Switch to the New IOTA Wallet</Text>
    <div class="flex w-full flex-col space-y-6">
        <div class="flex w-full flex-col space-y-4">
            <TextHint variant={TextHintVariant.Info} text="Firefly is no longer maintained or receiving updates" />
            <Text fontSize="15"
                >For improved security, performance, and the latest features, please switch to our new browser
                extension.</Text
            >
        </div>
        <Button classes="w-full" onClick={onLinkClick}>Download New IOTA Wallet</Button>
    </div>
{/if}
