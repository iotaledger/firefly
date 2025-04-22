<script lang="ts">
    import { Button, Text, TextType, TextHint } from 'shared/components'
    import { TextHintVariant } from 'shared/components/enums'

    function onLinkClick(): void {
        window.open('https://chrome.google.com/webstore/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija', '_blank')
    }
</script>

<Text type={TextType.h5} classes="mb-5">Switch to the New IOTA Wallet</Text>
<div class="flex w-full flex-col space-y-6">
    <div class="flex w-full flex-col space-y-4">
        <TextHint variant={TextHintVariant.Info} text="Firefly is no longer maintained or receiving updates" />
        <Text fontSize="15"
            >For improved security, performance, and the latest features, please switch to our new browser extension.</Text
        >
    </div>
    <Button classes="w-full" onClick={onLinkClick}>Download New IOTA Wallet</Button>
</div>
