<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FoundryActivity } from '@core/wallet'

    export let activity: FoundryActivity

    let detailsList: { [key in string]: { data: string; isCopyable?: boolean } }
    $: detailsList = {
        aliasAddress: { data: activity.aliasAddress, isCopyable: true },
        assetId: { data: activity.assetId, isCopyable: true },
        maximumSupply: { data: String(parseInt(activity.maximumSupply, 16)) },
        mintedTokens: { data: String(parseInt(activity.mintedTokens, 16)) },
        meltedTokens: { data: String(parseInt(activity.meltedTokens, 16)) },
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox
        keyText={localize(`popups.nativeToken.property.${key}`)}
        valueText={value.data}
        isCopyable={value.isCopyable}
    />
{/each}
