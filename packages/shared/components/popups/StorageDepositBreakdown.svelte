<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { HR, TextTile, Text } from 'shared/components'
</script>

<div class="flex flex-col space-y-6">
    <Text type="h3" fontWeight={FontWeightText.semibold} lineHeight="24">Storage deposit breakdown</Text>
    <HR hidden />
    <TextTile
        leftPrimaryText="Locked in pending transactions"
        leftSecondaryText="For sending native assets and small IOTA amounts"
        rightPrimaryText="1.83 Mi"
        rightSecondaryText="$ 2.45"
    />
    <HR hidden />
    <TextTile
        leftPrimaryText="Reserved for Native Tokens"
        leftSecondaryText="For storing native tokens"
        rightPrimaryText="1.83 Mi"
        rightSecondaryText="$ 2.45"
    />
    <HR hidden />
    <TextTile
        leftPrimaryText="Reserved for NFTs"
        leftSecondaryText="For storing NFTs"
        rightPrimaryText="1.83 Mi"
        rightSecondaryText="$ 2.45"
    />
    <HR hidden />
    <TextTile
        leftPrimaryText="Total storage deposit"
        leftPrimaryFontWeight={FontWeightText.semibold}
        rightPrimaryText="1.83 Mi"
        rightPrimaryFontWeight={FontWeightText.semibold}
        rightSecondaryText="$ 2.45"
    />
</div>
