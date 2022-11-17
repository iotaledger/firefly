<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FoundryActivity, getAssetFromPersistedAssets } from '@core/wallet'

    export let activity: FoundryActivity

    $: asset = getAssetFromPersistedAssets(activity.assetId)

    let detailsList: { [key in string]: string }
    $: detailsList = {
        tokenName: asset.metadata.name,
        decimals: String(asset.metadata.decimals),
        totalSupply: String(parseInt(activity.maximumSupply, 16)),
        circulatingSupply: String(parseInt(activity.mintedTokens, 16)),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`popups.nativeToken.property.${key}`)} valueText={value} isCopyable />
{/each}
