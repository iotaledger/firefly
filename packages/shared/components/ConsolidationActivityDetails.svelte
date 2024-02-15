<script lang="ts">
    import { TransactionActivityStatusPill } from '@ui'
    import { ConsolidationActivity } from '@core/wallet'

    export let activity: ConsolidationActivity
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    <transaction-status class="flex flex-row w-full space-x-2 justify-center">
        {#if activity.inclusionState && activity.direction}
            <TransactionActivityStatusPill
                type={activity.type}
                direction={activity.direction}
                action={activity.action}
                isInternal={activity.isInternal}
                inclusionState={activity.inclusionState}
            />
        {/if}
    </transaction-status>
</main-content>
