<script lang="ts">
    import { onMount } from 'svelte'
    import {
        Button,
        KeyValueBox,
        Text,
        Modal,
        MeatballMenuButton,
        ProposalsDetailsMenu,
        ButtonSize,
        FontWeight,
    } from '@ui'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfileId } from '@core/profile'
    import {
        getNumberOfActiveProposals,
        getNumberOfTotalProposals,
        getNumberOfVotedProposals,
        getNumberOfVotingProposals,
        participationOverviewForSelectedAccount,
        registeredProposalsForSelectedAccount,
        updateParticipationOverview,
        IProposalsDetails,
    } from '@contexts/governance'
    import { openPopup, PopupId } from '@auxiliary/popup'

    let details = <IProposalsDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }
    let modal: Modal

    $: isOverviewLoaded = !!$participationOverviewForSelectedAccount
    $: $registeredProposalsForSelectedAccount, $participationOverviewForSelectedAccount, updateProposalsDetails()
    $: $selectedAccount, setParticipationOverview()

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

    async function setParticipationOverview(): Promise<void> {
        if (!isOverviewLoaded || getNumberOfVotedProposals() === 0) {
            await updateParticipationOverview($selectedAccount.index)
        }
    }

    function onAddProposalClick(): void {
        openPopup({
            id: PopupId.AddProposal,
            overflow: true,
        })
    }

    onMount(setParticipationOverview)
</script>

<proposals-details class="space-y-4">
    <header-container class="flex justify-between items-center">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposalsDetails.title')}
        </Text>

        <div class="max-h-7 max-w-9 flex-none overflow-visible relative">
            <MeatballMenuButton onClick={modal?.toggle} />
            <ProposalsDetailsMenu bind:modal position={{ right: '0' }} classes="mt-1.5" />
        </div>
    </header-container>
    <ul class="space-y-2">
        {#each Object.keys(details) as detailKey}
            <li>
                <KeyValueBox
                    keyText={localize(`views.governance.proposalsDetails.${detailKey}`)}
                    valueText={details[detailKey]?.toString() ?? '-'}
                    isLoading={details[detailKey] === undefined}
                />
            </li>
        {/each}
    </ul>
    <Button size={ButtonSize.Medium} outline onClick={onAddProposalClick} classes="w-full">
        {localize('actions.addProposal')}
    </Button>
</proposals-details>
