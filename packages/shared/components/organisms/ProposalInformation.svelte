<script lang="typescript">
    import { KeyValueBox, Pane, Text } from 'shared/components'
    import { formatDate, localize } from '@core/i18n'
    import { networkStatus } from '@core/network'
    import { activeProfileId } from '@core/profile'
    import { DATE_FORMAT, IKeyValueBoxList, milestoneToDate, truncateString } from '@core/utils'
    import { proposalsState, selectedProposal } from '@contexts/governance/stores'
    import { ProposalStatus } from '../../lib/contexts/governance'

    const proposalDateData = getNextProposalPhaseData()

    interface IProposalDateData {
        propertyKey: 'votingOpens' | 'countingStarts' | 'countingEnds' | 'countingEnded'
        milestone: number
    }

    function getNextProposalPhaseData(): IProposalDateData {
        switch ($selectedProposal?.status) {
            case ProposalStatus.Upcoming:
                return {
                    propertyKey: 'votingOpens',
                    milestone: $selectedProposal?.milestones?.commencing,
                }
            case ProposalStatus.Commencing:
                return {
                    propertyKey: 'countingStarts',
                    milestone: $selectedProposal?.milestones?.holding,
                }
            case ProposalStatus.Holding:
                return {
                    propertyKey: 'countingEnds',
                    milestone: $selectedProposal?.milestones?.ended,
                }
            case ProposalStatus.Ended:
                return {
                    propertyKey: 'countingEnded',
                    milestone: $selectedProposal?.milestones?.ended,
                }
            default:
                throw new Error('Unable to determine proposal status')
        }
    }

    const proposalInformation: IKeyValueBoxList = {
        [proposalDateData.propertyKey]: {
            data: formatDate(milestoneToDate($networkStatus.currentMilestone, proposalDateData.milestone), DATE_FORMAT),
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
