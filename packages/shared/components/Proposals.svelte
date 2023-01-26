<script lang="typescript">
    import { Text, ProposalCard, Filter } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeight } from './enums'
    import { IProposal } from '@contexts/governance/interfaces'
    import { proposalFilter } from '@contexts/governance'
    import { isVisibleProposal } from '@contexts/governance/utils/isVisibleProposal'

    export let proposals: IProposal[] = []

    $: sortedProposals = proposals
        .filter((proposal) => isVisibleProposal(proposal, $proposalFilter))
        .sort((a, b) => (a.id < b.id ? -1 : 1))
</script>

<proposals-container class="flex flex-col h-full">
    <header-container class="flex justify-between items-center mb-4">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposals.title')}
        </Text>
        <div class="flex flex-row">
            <Filter filterStore={proposalFilter} />
        </div>
    </header-container>
    <ul class="grid grid-cols-2 auto-rows-min gap-6 flex-1 overflow-y-scroll">
        {#each sortedProposals as proposal}
            <ProposalCard {proposal} />
        {/each}
    </ul>
</proposals-container>
