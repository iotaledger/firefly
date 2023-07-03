<script lang="ts">
    import { localize } from '@core/i18n'
    import { ActivityAsyncStatus } from '@core/wallet'
    import Pill from './Pill.svelte'

    export let asyncStatus: ActivityAsyncStatus

    let backgroundColor = 'bg-gray-200 dark:bg-gray-300'
    const textColor = 'gray-800'

    $: {
        switch (asyncStatus) {
            case ActivityAsyncStatus.Unclaimed:
                backgroundColor = 'bg-purple-200 dark:bg-purple-200'
                break
            case ActivityAsyncStatus.Claimed:
                backgroundColor = 'bg-blue-200 dark:bg-blue-300'
                break
            case ActivityAsyncStatus.Expired:
                backgroundColor = 'bg-gray-200 dark:bg-gray-200'
                break
        }
    }
</script>

{#if asyncStatus}
    <Pill {backgroundColor} {textColor}>
        {localize('pills.asyncStatus.' + asyncStatus)}
    </Pill>
{/if}
