<script lang="typescript">
    import { ProposalsDetailsButton, Text, KeyValueBox } from 'shared/components'
    import { FontWeight } from './enums'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'
    import { IProposalsDetails } from '@contexts/governance/interfaces'
    import { participationOverview, proposalsState } from '@contexts/governance/stores'
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

    $: $proposalsState, $participationOverview, updateProposalsDetails()

    function updateProposalsDetails(): void {
        if ($activeProfileId) {
            details = {
                activeProposals: getNumberOfActiveProposals(),
                votingProposals: getNumberOfVotingProposals(),
                votedProposals: getTotalNumberOfProposals(),
            }
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
            <li>
                <KeyValueBox
                    keyText={localize(`views.governance.proposalsDetails.${detailKey}`)}
                    valueText={details[detailKey] ?? '-'}
                />
            </li>
        {/each}
    </ul>
</proposals-details>
