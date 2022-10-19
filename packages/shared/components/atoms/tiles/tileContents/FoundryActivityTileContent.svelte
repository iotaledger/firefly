<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        FoundryActivity,
        getFiatAmount,
        getFormattedAmountFromActivity,
        InclusionState,
        IPersistedAsset,
    } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { Text, AssetIcon, FontWeight } from 'shared/components'

    export let activity: FoundryActivity
    export let asset: IPersistedAsset

    $: amount = getFormattedAmountFromActivity(activity)
    $: fiatAmount = getFiatAmount(activity)
</script>

<AssetIcon {asset} showVerifiedBadgeOnly />
<div class="flex flex-col w-full space-y-0.5">
    <div class="flex flex-row justify-between space-x-1">
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            classes="overflow-hidden overflow-ellipsis multiwrap-line2"
        >
            {localize(activity.inclusionState === InclusionState.Confirmed ? 'general.minted' : 'general.minting')}
        </Text>
        <Text fontWeight={FontWeight.semibold} lineHeight="140" color="blue-700" classes="whitespace-nowrap">
            {amount}
        </Text>
    </div>

    <div class="flex flex-row justify-between">
        <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600">
            {asset?.metadata?.name ? truncateString(asset?.metadata?.name, 20, 0) : truncateString(asset?.id, 6, 7)}
        </Text>
        <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600" classes="whitespace-nowrap">
            {fiatAmount}
        </Text>
    </div>
</div>
