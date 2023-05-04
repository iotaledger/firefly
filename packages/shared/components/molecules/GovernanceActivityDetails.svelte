<script lang="ts">
    import { AmountBox, ActivityInclusionStatusPill, Text, FontWeight } from 'shared/components'
    import { getAssetFromPersistedAssets } from '@core/wallet'
    import { GovernanceActivity } from '@core/wallet'
    import { getCoinType } from '@core/profile'
    import { getVotingEvent } from '@contexts/governance/actions'
    import { truncateString } from '@core/utils'

    export let activity: GovernanceActivity

    const asset = getAssetFromPersistedAssets(getCoinType())

    $: amount = activity.votingPowerDifference ?? 0
    $: localizationKey = 'governance.' + activity.governanceAction
    $: activity.participation?.eventId, void setProposalName()

    let proposalName: string
    async function setProposalName(): Promise<void> {
        try {
            if (activity?.participation?.eventId) {
                proposalName = (await getVotingEvent(activity.participation.eventId)).data.name
            }
        } catch (err) {
            proposalName = truncateString(activity.participation.eventId, 6, 6)
        }
    }
</script>

<main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    {#if amount}
        <AmountBox {amount} {asset} />
    {/if}
    <governance-status class="flex flex-row w-full space-x-2 justify-center">
        <ActivityInclusionStatusPill {localizationKey} inclusionState={activity.inclusionState} />
    </governance-status>
    {#if proposalName}
        <Text color="gray-800" darkColor="gray-500" fontWeight={FontWeight.semibold} fontSize="text-15">
            {proposalName}
        </Text>
    {/if}
</main-content>
