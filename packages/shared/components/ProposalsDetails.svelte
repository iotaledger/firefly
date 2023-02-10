<script lang="ts">
    import { Text, KeyValueBox, Button, ButtonSize } from 'shared/components'
    import { FontWeight } from './enums'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'
    import { IProposalsDetails } from '@contexts/governance/interfaces'
    import {
        participationOverviewForSelectedAccount,
        registeredProposalsForSelectedAccount,
    } from '@contexts/governance/stores'
    import {
        getNumberOfActiveProposals,
        getNumberOfVotingProposals,
        getNumberOfVotedProposals,
        getNumberOfTotalProposals,
    } from '@contexts/governance/utils'
    import { openPopup } from '@auxiliary/popup'

    let details = <IProposalsDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }
    $: $registeredProposalsForSelectedAccount, $participationOverviewForSelectedAccount, updateProposalsDetails()

    function updateProposalsDetails(): void {
        if ($activeProfileId) {
            details = {
                totalProposals: getNumberOfTotalProposals(),
                activeProposals: getNumberOfActiveProposals(),
                votingProposals: getNumberOfVotingProposals(),
                votedProposals: getNumberOfVotedProposals(),
            }
        }
    }

    function onAddProposalClick(): void {
        openPopup({
            type: 'addProposal',
            overflow: true,
        })
    }
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
                />
            </li>
        {/each}
    </ul>
    <Button size={ButtonSize.Medium} outline onClick={onAddProposalClick} classes="w-full">
        {localize('actions.addProposal')}
    </Button>
</proposals-details>
