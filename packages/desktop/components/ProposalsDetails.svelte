<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, KeyValueBox, Text, Modal, MeatballMenuButton, ButtonSize, FontWeight, MenuItem } from '@ui'
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
    import { Icon } from '@auxiliary/icon'

    let modal: Modal
    let details = <IProposalsDetails>{
        totalProposals: null,
        activeProposals: null,
        votingProposals: null,
        votedProposals: null,
    }

    $: isOverviewLoaded = !!$participationOverviewForSelectedAccount
    $: $registeredProposalsForSelectedAccount, $participationOverviewForSelectedAccount, updateProposalsDetails()
    $: $selectedAccount, void setParticipationOverview()

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

    function onRevoteClick(): void {
        openPopup({
            id: PopupId.Revote,
        })
        modal.close()
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
            <Modal bind:this={modal} position={{ right: '0' }}>
                <div class="flex flex-col">
                    <MenuItem
                        icon={Icon.Delete}
                        iconProps={{ width: '16', height: '19' }}
                        title={localize('actions.revote')}
                        onClick={onRevoteClick}
                    />
                </div>
            </Modal>
        </div>
    </header-container>

    <div class="space-y-2">
        {#each Object.entries(details) as [detailKey, detailValue]}
            <KeyValueBox
                keyText={localize(`views.governance.proposalsDetails.${detailKey}`)}
                valueText={detailValue?.toString() ?? '-'}
                isLoading={detailValue === undefined}
            />
        {/each}
    </div>

    <Button size={ButtonSize.Medium} outline onClick={onAddProposalClick} classes="w-full">
        {localize('actions.addProposal')}
    </Button>
</proposals-details>
