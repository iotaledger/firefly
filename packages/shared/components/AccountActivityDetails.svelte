<script lang="ts">
    import { AddressBox, ActivityInclusionStatusPill } from '@ui'
    import { AccountActivity } from '@core/wallet'

    export let activity: AccountActivity
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    <account-status class="flex flex-row w-full space-x-2 justify-center">
        <ActivityInclusionStatusPill localizationKey={'account.creation'} inclusionState={activity.inclusionState} />
    </account-status>
    <AddressBox clearBackground clearPadding isCopyable address={activity.transactionId} />
</main-content>
