<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FoundryActivity } from '@core/wallet'

    export let activity: FoundryActivity

    let detailsList: { [key in string]: string }
    $: detailsList = {
        aliasAddress: activity.aliasAddress,
        maximumSupply: String(parseInt(activity.maximumSupply, 16)),
        mintedTokens: String(parseInt(activity.mintedTokens, 16)),
        meltedTokens: String(parseInt(activity.meltedTokens, 16)),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`popups.nativeToken.property.${key}`)} valueText={value} isCopyable />
{/each}
