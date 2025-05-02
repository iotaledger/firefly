<script lang="ts">
    import { Button, Text, TextType, TextHint } from 'shared/components'
    import { TextHintVariant } from 'shared/components/enums'
    import { getEnabledNetworkFromFeatureFlags } from '@core/network'
    import { NetworkId } from '@core/network/enums'

    const NETWORK_ID = getEnabledNetworkFromFeatureFlags()

    function onLinkClick(): void {
        window.open('https://chrome.google.com/webstore/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija', '_blank')
    }
</script>

{#if NETWORK_ID === [NetworkId.Shimmer] || NETWORK_ID === [NetworkId.ShimmerTestnet]}
    <Text type={TextType.h5} classes="mb-5">Firefly Shimmer is no longer maintained</Text>
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
    <Text type={TextType.h5} classes="mb-5">Switch to the new IOTA Wallet</Text>
    <div class="flex w-full flex-col space-y-6">
        <div class="flex w-full flex-col space-y-4">
            <TextHint variant={TextHintVariant.Info} text="Firefly is no longer maintained or receiving updates" />
            <Text fontSize="15"
                >Firefly is no longer actively maintained by the IOTA Foundation and is no longer compatible with the
                new IOTA Network.
            </Text>
            <Text fontSize="15">Please switch to our new IOTA Wallet browser extension.</Text>
        </div>
        <Button classes="w-full" onClick={onLinkClick}>Download New IOTA Wallet</Button>
    </div>
{/if}
