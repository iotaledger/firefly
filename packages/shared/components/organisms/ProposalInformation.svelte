<script lang="typescript">
    import { Text, Pane, KeyValueBox } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network'
    import { activeProfileId } from '@core/profile'
    import { DATE_FORMAT, IKeyValueBoxList, milestoneToDate, truncateString } from '@core/utils'
    import { proposalsState, selectedProposal } from '@contexts/governance/stores'

    const proposalInformation: IKeyValueBoxList = {
        countingEnds: {
            data: formatDate(
                milestoneToDate($networkStatus.currentMilestone, $selectedProposal.milestones?.ended),
                DATE_FORMAT
            ),
        },
        eventId: {
            data: truncateString($selectedProposal?.id, 9, 9),
            isCopyable: true,
            copyValue: $selectedProposal?.id,
        },
        nodeUrl: { data: $proposalsState[$activeProfileId]?.[$selectedProposal?.id].nodeUrl, isCopyable: true },
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
                    valueText={proposalInformation[counterKey].data}
                    isCopyable={proposalInformation[counterKey].isCopyable}
                    copyValue={proposalInformation[counterKey].copyValue}
                />
            </li>
        {/each}
    </ul>
</Pane>
