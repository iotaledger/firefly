<script lang="typescript">
    import { Text, Pane, KeyValueBox } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network'
    import { activeProfileId } from '@core/profile'
    import { DATE_FORMAT, milestoneToDate, truncateString } from '@core/utils'
    import { proposalsState, selectedProposal } from '@contexts/governance/stores'

    const proposalInformation = {
        countingEnds: formatDate(
            milestoneToDate($networkStatus.currentMilestone, $selectedProposal.milestones?.ended),
            DATE_FORMAT
        ),
        eventId: truncateString($selectedProposal?.id, 9, 9),
        nodeUrl: $proposalsState[$activeProfileId]?.[$selectedProposal?.id].nodeUrl,
    }
</script>

<Pane classes="p-6 h-fit">
    <Text smaller classes="mb-5">
        {localize('views.governance.details.proposalInformation.title')}
    </Text>
    <ul class="space-y-2">
        {#each Object.keys(proposalInformation) as counterKey}
            <li>
                <KeyValueBox
                    keyText={localize(`views.governance.details.proposalInformation.${counterKey}`)}
                    valueText={proposalInformation[counterKey]}
                />
            </li>
        {/each}
    </ul>
</Pane>
