<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        InclusionState,
        selectedAccountAssets,
        getAssetFromPersistedAssets,
        IPersistedAsset,
        IAliasActivityData,
    } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { openPopup } from '@lib/popup'
    import { ClickableTile, Text, AssetIcon } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'

    export let activityId: string
    export let inclusionState: InclusionState
    export let data: IAliasActivityData

    let asset: IPersistedAsset

    $: $selectedAccountAssets, (asset = getAssetFromPersistedAssets(data.assetId))

    function handleTransactionClick(): void {
        openPopup({
            type: 'activityDetails',
            props: { activityId },
        })
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
                <div class="flex flex-row">
                    <Text
                        fontWeight={FontWeight.semibold}
                        lineHeight="140"
                        classes="overflow-hidden overflow-ellipsis multiwrap-line2"
                    >
                        {localize(
                            inclusionState === InclusionState.Confirmed
                                ? 'general.aliasCreated'
                                : 'general.creatingAlias'
                        )}
                    </Text>
                </div>
                <div class="flex flex-row">
                    <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600">
                        {truncateString(data.aliasId, 20, 6)}
                    </Text>
                </div>
            </div>
        </div>
    </div>
</ClickableTile>
