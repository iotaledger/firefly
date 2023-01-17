<script lang="typescript">
    import { AmountBox, ActivityInclusionStatusPill } from 'shared/components'
    import { formatTokenAmountDefault, getAssetFromPersistedAssets } from '@core/wallet'
    import { GovernanceActivity } from '@core/wallet'
    import { BASE_TOKEN, COIN_TYPE } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let activity: GovernanceActivity

    $: asset = getAssetFromPersistedAssets(String(COIN_TYPE[$activeProfile.networkProtocol]))
    $: amount = activity.votingPowerDifference
        ? formatTokenAmountDefault(
              Number(activity.votingPowerDifference),
              BASE_TOKEN[$activeProfile.networkProtocol],
              asset?.metadata?.unit
          )
        : 0
    $: localizationKey = 'governance.' + activity.governanceAction
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    {#if amount}
        <AmountBox {amount} unit={asset?.metadata?.unit} {asset} />
    {/if}
    <governance-status class="flex flex-row w-full space-x-2 justify-center">
        <ActivityInclusionStatusPill {localizationKey} inclusionState={activity.inclusionState} />
    </governance-status>
</main-content>
