<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityAsyncStatus, ActivityStatus, ActivityType } from '@lib/typings/activity'
    import Pill from './Pill.svelte'

    export let asyncStatus: ActivityAsyncStatus

    let backgroundColor = 'gray-200'
    let darkBackgroundColor = 'gray-300'
    const textColor = 'gray-800'

    $: {
        switch (asyncStatus) {
            case ActivityAsyncStatus.Unclaimed:
                backgroundColor = 'yellow-200'
                darkBackgroundColor = 'yellow-300'
                break
            case ActivityAsyncStatus.Claimed:
                backgroundColor = 'purple-200'
                darkBackgroundColor = 'purple-300'
                break
            case ActivityAsyncStatus.Expired:
                backgroundColor = 'gray-200'
                darkBackgroundColor = 'gray-300'
                break
        }
    }
</script>

{#if asyncStatus}
    <Pill {backgroundColor} {darkBackgroundColor} {textColor}>
        {localize('pills.asyncStatus.' + asyncStatus).toLowerCase()}
    </Pill>
{/if}
