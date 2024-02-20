<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { AccountActivity } from '@core/wallet'

    export let activity: AccountActivity

    let detailsList: { [key in string]: string }
    $: detailsList = {
        accountAddress: activity.accountAddress,
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} isCopyable />
{/each}
