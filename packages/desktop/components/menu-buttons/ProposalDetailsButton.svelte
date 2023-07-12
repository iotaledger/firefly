<script lang="ts">
    import { onMount } from 'svelte'
    import { Modal, MenuItem, MeatballMenuButton, MenuItemVariant } from '@ui'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { IProposal } from '@contexts/governance'
    import { participationOverviewForSelectedAccount } from '@contexts/governance/stores'
    import { isVotingForSelectedProposal } from '@contexts/governance/utils'
    import { Icon } from '@auxiliary/icon'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import features from '@features/features'

    export let proposal: IProposal
    export let modal: Modal = undefined

    let isVotingForProposal: boolean
    let isBusy = true // starts in a busy state because data needs to be fetched before displaying selectable options

    $: isTransferring = $selectedAccount?.isTransferring
    $: isTransferring, $participationOverviewForSelectedAccount, void updateIsVoting() // vote/stop vote changes the isTransferring value. Relying on this requires less updates than relying on proposalsState
    $: isBusy = isVotingForProposal === undefined

    $: buttons = [
        {
            icon: Icon.Node,
            title: localize('actions.changeNode'),
            onClick: onChangeNodeClick,
        },
        {
            icon: Icon.Delete,
            title: isBusy ? localize('views.governance.details.fetching') : localize('actions.removeProposal'),
            onClick: onRemoveProposalClick,
            variant: MenuItemVariant.Error,
            isLoading: isBusy,
            disabled: getDisabled(proposal, isVotingForProposal),
            enableTooltipVisible: isVotingForProposal !== undefined,
            tooltip: localize('tooltips.governance.removeProposalWarning'),
        },
    ]

    function getDisabled(proposal: IProposal, isVoting: boolean): boolean {
        if (features.governance.removeProposals.enabled) {
            if (proposal.error === undefined) {
                return isVoting
            } else {
                return false
            }
        } else {
            return true
        }
    }

    function onChangeNodeClick(): void {
        openPopup({
            id: PopupId.AddProposal,
            props: {
                initialEventId: proposal.id,
                initialNodeUrl: proposal.nodeUrl,
            },
            overflow: true,
        })
        modal.close()
    }

    function onRemoveProposalClick(): void {
        openPopup({
            id: PopupId.RemoveProposal,
        })
        modal.close()
    }

    function updateIsVoting(): void {
        try {
            isVotingForProposal = isVotingForSelectedProposal()
        } catch (err) {
            handleError(err)
        }
    }

    onMount(() => void updateIsVoting())
</script>

<div class="max-h-7 max-w-9 flex-none flex-initial overflow-visible relative">
    <MeatballMenuButton onClick={modal?.toggle} />
    <Modal bind:this={modal} position={{ right: '0' }} classes="mt-1.5">
        <div class="flex flex-col">
            {#each buttons as button}
                <MenuItem {...button} />
            {/each}
        </div>
    </Modal>
</div>
