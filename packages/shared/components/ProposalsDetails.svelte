<script lang="ts">
    import { ProposalsDetailsButton, Text, KeyValueBox } from 'shared/components'
    import { FontWeight } from './enums'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'
    import { IProposalsDetails } from '@contexts/governance/interfaces'
    import { participationOverviewForSelectedAccount, proposalStates } from '@contexts/governance/stores'
    import {
        getNumberOfActiveProposals,
        getNumberOfVotingProposals,
        getNumberOfVotedProposals,
        getNumberOfTotalProposals,
    } from '@contexts/governance/utils'
    import { governanceLoadingState } from '@contexts/governance/stores/governance-loading-state.store'
    import { GovernanceLoadingState } from '@contexts/governance/enums'

    let details = <IProposalsDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }
    $: $proposalStates, $participationOverviewForSelectedAccount, $governanceLoadingState, updateProposalsDetails()
    $: loadingCompleted = $governanceLoadingState === GovernanceLoadingState.Completed
    $: metadataLoaded = $governanceLoadingState === GovernanceLoadingState.MetadataLoaded || loadingCompleted
    $: $proposalStates, $participationOverviewForSelectedAccount, updateProposalsDetails()

    function updateProposalsDetails(): void {
        if ($activeProfileId) {
            details = {
                totalProposals: metadataLoaded ? getNumberOfTotalProposals() : null,
                activeProposals: loadingCompleted ? getNumberOfActiveProposals() : null,
                votingProposals: loadingCompleted ? getNumberOfVotingProposals() : null,
                votedProposals: loadingCompleted ? getNumberOfVotedProposals() : null,
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
        {$governanceLoadingState}
        {#each Object.keys(details) as detailKey}
            <li>
                <KeyValueBox
                    keyText={localize(`views.governance.proposalsDetails.${detailKey}`)}
                    valueText={details[detailKey]?.toString() ?? '-'}
                    isLoading={details[detailKey] === null}
                />
            </li>
        {/each}
    </ul>
</proposals-details>
