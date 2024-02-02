<script lang="ts">
    import { Height, KeyValueBox, Pane, Text } from '@ui'
    import { formatDate, localize } from '@core/i18n'
    import { DATE_FORMAT, IKeyValueBoxList, slotToDate, truncateString } from '@core/utils'
    import { networkStatus } from '@core/network/stores'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { selectedProposal } from '@contexts/governance/stores'

    export let classes: string = ''

    interface IProposalDateData {
        propertyKey: 'votingOpens' | 'countingStarts' | 'countingEnds' | 'countingEnded'
        slot: number
    }

    $: proposalDateData = getNextProposalDateData($selectedProposal?.status)

    function getNextProposalDateData(status: string): IProposalDateData {
        switch (status) {
            case ProposalStatus.Upcoming:
                return {
                    propertyKey: 'votingOpens',
                    slot: $selectedProposal?.slots?.commencing,
                }
            case ProposalStatus.Commencing:
                return {
                    propertyKey: 'countingStarts',
                    slot: $selectedProposal?.slots?.holding,
                }
            case ProposalStatus.Holding:
                return {
                    propertyKey: 'countingEnds',
                    slot: $selectedProposal?.slots?.ended,
                }
            case ProposalStatus.Ended:
                return {
                    propertyKey: 'countingEnded',
                    slot: $selectedProposal?.slots?.ended,
                }
            default:
                return undefined
        }
    }

    let proposalInformation: IKeyValueBoxList
    $: proposalInformation = {
        ...(proposalDateData?.propertyKey && {
            [proposalDateData.propertyKey]: {
                data: formatDate(slotToDate($networkStatus.currentSlot, proposalDateData.slot), DATE_FORMAT),
            },
        }),
        eventId: {
            data: truncateString($selectedProposal?.id, 9, 9),
            isCopyable: true,
            copyValue: $selectedProposal?.id,
        },
        nodeUrl: { data: $selectedProposal?.nodeUrl, isCopyable: true },
    }
</script>

<Pane height={Height.Fit}>
    <Text smaller classes="mb-5">
        {localize('views.governance.details.proposalInformation.title')}
    </Text>
    <ul class="space-y-2">
        {#each Object.keys(proposalInformation) as counterKey}
            <li>
                <KeyValueBox
                    keyText={localize(`views.governance.details.proposalInformation.${counterKey}`)}
                    valueText={proposalInformation[counterKey]?.data}
                    isCopyable={proposalInformation[counterKey].isCopyable}
                    copyValue={proposalInformation[counterKey].copyValue}
                />
            </li>
        {/each}
    </ul>
</Pane>
