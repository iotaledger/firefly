<script lang="ts">
    import { KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { ActivityAccount } from '@core/wallet'

    export let activity: ActivityAccount

    let detailsList: { [key in string]: string }
    $: detailsList = {
        accountAddress: activity.accountAddress(),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} isCopyable />
{/each}
