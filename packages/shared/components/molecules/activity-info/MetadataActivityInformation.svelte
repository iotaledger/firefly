<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FoundryActivity, getAssetFromPersistedAssets, ITokenMetadata } from '@core/wallet'

    export let activity: FoundryActivity

    let metadata: ITokenMetadata
    $: metadata = getAssetFromPersistedAssets(activity.assetId)?.metadata

    let detailsList: { [key in string]: { data: string; tooltipText?: string; isCopyable?: boolean } }
    $: detailsList = {
        ...(metadata?.name && {
            tokenName: { data: metadata.name },
        }),
        ...(metadata?.unit && {
            unit: { data: metadata.unit },
        }),
        ...(metadata?.subunit && {
            subunit: { data: metadata.subunit },
        }),
        ...(metadata?.decimals && {
            decimals: { data: String(metadata.decimals) },
        }),
        ...(metadata?.tickerSymbol && {
            tickerSymbol: { data: metadata.tickerSymbol },
        }),
        ...(metadata?.url && {
            url: { data: metadata.url, isCopyable: true },
        }),
        ...(metadata?.logo && {
            logo: { data: metadata.logo, isCopyable: true },
        }),
        ...(metadata?.logoUrl && {
            logoUrl: { data: metadata.logoUrl, isCopyable: true },
        }),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox
        keyText={localize(`popups.nativeToken.property.${key}`)}
        valueText={value.data}
        isCopyable={value.isCopyable}
    />
{/each}
