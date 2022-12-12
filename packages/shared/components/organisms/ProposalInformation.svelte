<script lang="typescript">
    import { networkStatus } from '@core/network'
    import { selectedProposal } from '@core/governance/stores'
    import { formatDate, localize } from '@core/i18n'
    import { DATE_FORMAT, milestoneToDate, truncateString } from '@core/utils'
    import { Text, Pane, FontWeight } from 'shared/components'

    const proposalInformation = {
        countingEnds: formatDate(
            milestoneToDate($networkStatus.currentMilestone, $selectedProposal.milestones?.closed),
            DATE_FORMAT
        ),
        eventId: truncateString($selectedProposal?.id, 9, 9),
        nodeUrl: $selectedProposal.nodeUrls[0].url,
    }
</script>

<Pane classes="p-6 h-fit">
    <Text smaller classes="mb-5">
        {localize('views.governance.details.proposalInformation.title')}
    </Text>
    <ul class="space-y-2">
        {#each Object.keys(proposalInformation) as counterKey}
            <li class="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
                <Text fontWeight={FontWeight.medium} overrideColor classes="text-gray-600">
                    {localize(`views.governance.details.proposalInformation.${counterKey}`)}
                </Text>
                <Text overrideColor classes="text-gray-600">
                    {proposalInformation[counterKey]}
                </Text>
            </li>
        {/each}
    </ul>
</Pane>
