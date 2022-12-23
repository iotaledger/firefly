<script lang="typescript">
    import { onMount } from 'svelte'
    import { MenuItem, Modal, Text, Tooltip } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { isVotingForSelectedProposal, isAnyAccountVotingForSelectedProposal } from '@contexts/governance/utils'
    import { Icon } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup/actions'

    export let modal: Modal = undefined

    let isVotingForProposal: boolean
    let isAnyAccountVotingForProposal: boolean
    let deleteMenuItem
    let isTooltipVisible = false

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

    async function onMountHelper(): Promise<void> {
        try {
            isVotingForProposal = await isVotingForSelectedProposal()
            isAnyAccountVotingForProposal = await isAnyAccountVotingForSelectedProposal()
        } catch (err) {
            handleError(err)
        }
    }

    function showTooltip(show: boolean): void {
        isTooltipVisible = isAnyAccountVotingForProposal && show
    }

    onMount(() => void onMountHelper())
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
            <div
                bind:this={deleteMenuItem}
                on:mouseenter={() => showTooltip(true)}
                on:mouseleave={() => showTooltip(false)}
            >
                <MenuItem
                    icon={Icon.Delete}
                    iconProps={{ width: '16', height: '19' }}
                    title={localize('actions.removeProposal')}
                    onClick={onRemoveProposalClick}
                    variant="error"
                    disabled={isAnyAccountVotingForProposal}
                />
            </div>
            {#if isTooltipVisible}
                <Tooltip anchor={deleteMenuItem} position={Position.Right}>
                    <Text smaller>{localize('tooltips.governance.removeProposalWarning')}</Text>
                </Tooltip>
            {/if}
        {/if}
    </div>
</Modal>
