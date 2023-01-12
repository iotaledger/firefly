<script lang="typescript">
    import { onMount } from 'svelte'
    import { Modal, MenuItem } from 'shared/components'
    import { Icon } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup/actions'
    import { handleError } from '@core/error/handlers'
    import { isVotingForSelectedProposal } from '@contexts/governance/utils'
    import { localize } from '@core/i18n'
    import { proposalsState } from '@contexts/governance'

    export let modal: Modal = undefined

    let isVotingForProposal: boolean

    $: $proposalsState, onMountHelper()

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

    function onMountHelper(): void {
        try {
            isVotingForProposal = isVotingForSelectedProposal()
        } catch (err) {
            handleError(err)
        }
    }

    onMount(() => onMountHelper())
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        {#if isVotingForProposal}
            <MenuItem
                icon={Icon.Close}
                iconProps={{ width: '16', height: '16' }}
                title={localize('actions.stopVoting')}
                onClick={onStopVotingClick}
            />
        {:else}
            <MenuItem
                icon={Icon.Delete}
                iconProps={{ width: '16', height: '19' }}
                title={localize('actions.removeProposal')}
                onClick={onRemoveProposalClick}
                variant="error"
            />
        {/if}
    </div>
</Modal>
