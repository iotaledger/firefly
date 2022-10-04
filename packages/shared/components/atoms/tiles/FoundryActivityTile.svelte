<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        InclusionState,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        IPersistedAsset,
        IFoundryActivityData,
        NotVerifiedStatus,
    } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { openPopup } from '@lib/popup'
    import { ClickableTile, Text, AssetIcon, FontWeight } from 'shared/components'

    export let activityId: string
    export let amount: string
    export let fiatAmount: string
    export let inclusionState: InclusionState
    export let data: IFoundryActivityData

    let asset: IPersistedAsset

    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(data.assetId))

    function handleTransactionClick(): void {
        if (asset?.verification?.status === NotVerifiedStatus.New) {
            openPopup({
                type: 'tokenInformation',
                overflow: true,
                props: {
                    activityId,
                    asset,
                },
            })
        } else {
            openPopup({
                type: 'activityDetails',
                props: { activityId },
            })
        }
    }
</script>

<ClickableTile
    onClick={handleTransactionClick}
    classes={inclusionState === InclusionState.Confirmed ? '' : 'opacity-50'}
>
    <div class="w-full flex flex-col space-y-4">
        <div class="flex flex-row items-center text-left space-x-4">
            <AssetIcon {asset} showVerifiedBadgeOnly />
            <div class="flex flex-col w-full space-y-0.5">
                <div class="flex flex-row justify-between space-x-1">
                    <Text
                        fontWeight={FontWeight.semibold}
                        lineHeight="140"
                        classes="overflow-hidden overflow-ellipsis multiwrap-line2"
                    >
                        {localize(inclusionState === InclusionState.Confirmed ? 'general.minted' : 'general.minting')}
                    </Text>
                    <Text
                        fontWeight={FontWeight.semibold}
                        lineHeight="140"
                        color="blue-700"
                        classes="whitespace-nowrap"
                    >
                        {amount}
                    </Text>
                </div>

                <div class="flex flex-row justify-between">
                    <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600">
                        {asset?.metadata?.name
                            ? truncateString(asset?.metadata?.name, 20, 0)
                            : truncateString(asset?.id, 6, 7)}
                    </Text>
                    <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600" classes="whitespace-nowrap">
                        {fiatAmount}
                    </Text>
                </div>
            </div>
        </div>
    </div>
</ClickableTile>
