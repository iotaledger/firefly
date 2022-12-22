<script lang="typescript">
    import { ProposalsDetailsButton, Text } from 'shared/components'
    import { FontWeight } from './enums'
    import { localize } from '@core/i18n'
    import { IProposalsDetails } from '@contexts/governance/interfaces'
    import { proposalsState } from '@contexts/governance/stores'
    import {
        getNumberOfActiveProposals,
        getNumberOfVotingProposals,
        getTotalNumberOfProposals,
    } from '@contexts/governance/utils'

    let details = <IProposalsDetails>{
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }

    $: $proposalsState, void updateProposalsDetails()

    async function updateProposalsDetails(): Promise<void> {
        details = {
            activeProposals: getNumberOfActiveProposals(),
            votingProposals: await getNumberOfVotingProposals(),
            votedProposals: await getTotalNumberOfProposals(),
        }
    }
</script>

<proposals-details>
    <header-container class="flex justify-between items-center mb-4">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposalsDetails.title')}
        </Text>
        <ProposalsDetailsButton />
    </header-container>
    <ul class="space-y-2">
        {#each Object.keys(details) as detailKey}
            <li class="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
                <Text fontWeight={FontWeight.medium} overrideColor classes="text-gray-600">
                    {localize(`views.governance.proposalsDetails.${detailKey}`)}
                </Text>
                <Text overrideColor classes="text-gray-600">
                    {details[detailKey] ?? '-'}
                </Text>
            </li>
        {/each}
    </ul>
</proposals-details>
