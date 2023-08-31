<script lang="ts">
    import { localize } from '@core/i18n'
    import { ActivityAsyncStatus } from '@core/wallet'
    import Pill from './Pill.svelte'

    export let asyncStatus: ActivityAsyncStatus

    let backgroundColor = 'gray-200'
    let darkBackgroundColor = 'gray-300'
    const textColor = 'gray-800'
    $: {
        switch (asyncStatus) {
            case ActivityAsyncStatus.Unclaimed:
                backgroundColor = 'purple-200'
                darkBackgroundColor = 'purple-200'
                break
            case ActivityAsyncStatus.Claimed:
                backgroundColor = 'blue-200'
                darkBackgroundColor = 'blue-300'
                break
            case ActivityAsyncStatus.Expired:
                backgroundColor = 'gray-200'
                darkBackgroundColor = 'gray-200'
                break
        }
    }
</script>

{#if asyncStatus}
    <Pill {backgroundColor} {darkBackgroundColor} {textColor}>
        {localize('pills.asyncStatus.' + asyncStatus)}
    </Pill>
{/if}
