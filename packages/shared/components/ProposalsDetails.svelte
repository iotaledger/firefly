<script lang="ts">
    import { Text, KeyValueBox, Button, ButtonSize } from 'shared/components'
    import { FontWeight } from './enums'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'
    import { IProposalsDetails } from '@contexts/governance/interfaces'
    import {
        participationOverviewForSelectedAccount,
        registeredProposalsForSelectedAccount,
        updateParticipationOverview,
    } from '@contexts/governance/stores'
    import {
        getNumberOfActiveProposals,
        getNumberOfVotingProposals,
        getNumberOfVotedProposals,
        getNumberOfTotalProposals,
    } from '@contexts/governance/utils'
    import { openPopup } from '@auxiliary/popup'
    import { onMount } from 'svelte'
    import { selectedAccount } from '@core/account'

    let details = <IProposalsDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }
    let isLoadingOverview = false
    $: $registeredProposalsForSelectedAccount, $participationOverviewForSelectedAccount, updateProposalsDetails()

    function updateProposalsDetails(): void {
        if ($activeProfileId) {
            details = {
                totalProposals: getNumberOfTotalProposals(),
                activeProposals: isLoadingOverview ? getNumberOfActiveProposals() : null,
                votingProposals: isLoadingOverview ? getNumberOfVotingProposals() : null,
                votedProposals: isLoadingOverview ? getNumberOfVotedProposals() : null,
            }
        }
    }

    function onAddProposalClick(): void {
        openPopup({
            type: 'addProposal',
            overflow: true,
        })
    }

    onMount(async () => {
        isLoadingOverview = true
        // Should we put this after the login?
        await updateParticipationOverview($selectedAccount.index)
        isLoadingOverview = false
    })
</script>

<proposals-details class="space-y-4">
    <header-container class="flex justify-left items-center">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposalsDetails.title')}
        </Text>
    </header-container>
    <ul class="space-y-2">
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
    <Button size={ButtonSize.Medium} outline onClick={onAddProposalClick} classes="w-full">
        {localize('actions.addProposal')}
    </Button>
</proposals-details>
