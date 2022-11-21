<script lang="typescript">
    import { AddressBox, ActivityInclusionStatusPill } from 'shared/components'
    import { AliasActivity } from '@core/wallet'

    export let activity: AliasActivity
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    <alias-status class="flex flex-row w-full space-x-2 justify-center">
        <ActivityInclusionStatusPill localizationKey={'alias.creation'} inclusionState={activity.inclusionState} />
    </alias-status>
    <AddressBox clearBackground clearPadding isCopyable address={activity.aliasId} />
</main-content>
