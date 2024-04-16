<script lang="ts">
    import { AddressBox, ActivityInclusionStatusPill, AmountBox } from '@ui'
    import { DelegationActivity, getAssetFromPersistedAssets } from '@core/wallet'
    import { getBaseToken, getCoinType } from '@core/profile'

    export let activity: DelegationActivity

    const asset = getAssetFromPersistedAssets(getCoinType())
    const unit = getBaseToken().unit

    $: amount = activity.delegatedAmount
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    <AmountBox {amount} {asset} {unit} />
    <account-status class="flex flex-row w-full space-x-2 justify-center">
        <ActivityInclusionStatusPill localizationKey={'delegation.creation'} inclusionState={activity.inclusionState} />
    </account-status>
    <AddressBox clearBackground clearPadding isCopyable address={activity.transactionId} />
</main-content>
