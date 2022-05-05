<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityStatus, ActivityType } from '@lib/typings/activity'
    import Pill from './Pill.svelte'

    export let type: ActivityType
    export let status: ActivityStatus

    let backgroundColor = 'gray-200'
    let darkBackgroundColor = 'gray-300'
    const textColor = 'gray-800'

    $: {
        switch (status) {
            case ActivityStatus.InProgress:
            case ActivityStatus.Pending:
                backgroundColor = 'blue-200'
                darkBackgroundColor = 'blue-300'
                break
            case ActivityStatus.Confirmed:
                backgroundColor = 'green-200'
                darkBackgroundColor = 'green-300'
                break
            case ActivityStatus.Failed:
            case ActivityStatus.Conflict:
                backgroundColor = 'red-200'
                darkBackgroundColor = 'red-300'
                break
        }
    }
</script>

{#if type && status}
    <Pill {backgroundColor} {textColor}>
        {localize('pills.' + type + '.' + status).toLowerCase()}
    </Pill>
{/if}
