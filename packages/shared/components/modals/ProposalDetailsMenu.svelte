<script lang="typescript">
    import { Modal, MenuItem } from 'shared/components'
    import { Icon } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup/actions'
    import { handleError } from '@core/error/handlers'
    import { isVotingForProposal } from '@core/governance/utils'
    import { localize } from '@core/i18n'

    export let modal: Modal = undefined

    let _isVotingForProposal
    isVotingForProposal()
        .then((result) => (_isVotingForProposal = result))
        .catch((err) => handleError(err))

    function onStopVotingClick(): void {
        openPopup({
            type: 'stopVoting',
        })
        modal.close()
    }

    function onRemoveProposalClick(): void {
        openPopup({
            type: 'removeProposal',
        })
        modal.close()
    }

    // TODO: User can only remove a proposal when he is not voting for it
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        {#if !_isVotingForProposal}
            <MenuItem
                icon={Icon.Minus}
                iconProps={{ width: '16', height: '19' }}
                title={localize('actions.stopVoting')}
                onClick={onStopVotingClick}
            />
        {/if}
        <MenuItem
            icon={Icon.Delete}
            iconProps={{ width: '16', height: '19' }}
            title={localize('actions.removeProposal')}
            onClick={onRemoveProposalClick}
        />
    </div>
</Modal>
