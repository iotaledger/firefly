<script lang="ts">
    import { KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { AliasActivity } from '@core/wallet'

    export let activity: AliasActivity

    let detailsList: { [key in string]: string }
    $: detailsList = {
        aliasId: activity.aliasId,
        governorAddress: activity.governorAddress,
        stateControllerAddress: activity.stateControllerAddress,
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} isCopyable />
{/each}
