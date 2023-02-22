<script lang="ts">
    import { onMount } from 'svelte'
    import { Modal, MenuItem, MeatballMenuButton } from 'shared/components'
    import { Icon } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup/actions'
    import { handleError } from '@core/error/handlers'
    import { isVotingForSelectedProposal } from '@contexts/governance/utils'
    import { participationOverviewForSelectedAccount } from '@contexts/governance/stores'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    // TODO: https://github.com/iotaledger/firefly/issues/5801
    import features from '../../../../desktop/features/features'
    import { PopupId } from '@auxiliary/popup'
    import { IProposal } from '@contexts/governance'

    export let proposal: IProposal
    export let modal: Modal = undefined

    let isVotingForProposal: boolean
    let isBusy = true // starts in a busy state because data needs to be fetched before displaying selectable options

    $: isTransferring = $selectedAccount?.isTransferring
    $: isTransferring, $participationOverviewForSelectedAccount, void updateIsVoting() // vote/stop vote changes the isTransferring value. Relying on this requires less updates than relying on proposalsState
    $: isBusy = isVotingForProposal === undefined

    $: buttons = [
        {
            icon: Icon.Delete,
            title: localize('actions.changeNode'),
            onClick: onChangeNodeClick,
        },
        {
            icon: Icon.Delete,
            title: isBusy ? localize('views.governance.details.fetching') : localize('actions.removeProposal'),
            onClick: onRemoveProposalClick,
            variant: 'error',
            isLoading: isBusy,
            disabled: !features.governance.removeProposals.enabled || isVotingForProposal,
            enableTooltipVisible: isVotingForProposal !== undefined,
            tooltip: localize('tooltips.governance.removeProposalWarning'),
        },
    ]

    function onChangeNodeClick(): void {
        openPopup({
            id: PopupId.AddProposal,
            props: {
                initialEventId: proposal.id,
                initialNodeUrl: proposal.nodeUrl,
            },
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
