<script lang="typescript">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { NftActivity } from '@core/wallet'

    export let activity: NftActivity

    let detailsList: { [key in string]: string }
    $: detailsList = {
        // nft standard?
        nftId: activity.nftId,
        // immutable issuer name?
        // nft address?
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} isCopyable />
{/each}
