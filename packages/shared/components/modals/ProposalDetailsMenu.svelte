<script lang="ts">
    import { onMount } from 'svelte'
    import { Modal, MenuItem, Text, Tooltip, Spinner } from 'shared/components'
    import { Position } from 'shared/components/enums'
    import { Icon } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup/actions'
    import { handleError } from '@core/error/handlers'
    import { isVotingForSelectedProposal } from '@contexts/governance/utils'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account/stores'
    import { participationOverview } from '@contexts/governance'

    export let modal: Modal = undefined

    let isVotingForProposal: boolean
    let deleteMenuItem: HTMLDivElement
    let isTooltipVisible = false
    let isBusy = true // starts in a busy state because data needs to be fetched before displaying selectable options

    $: isTransferring = $selectedAccount?.isTransferring
    $: isTransferring, $participationOverview, void updateIsVoting() // vote/stop vote changes the isTransferring value. Relying on this requires less updates than relying on proposalsState
    $: isBusy = isVotingForProposal === undefined

    function onRemoveProposalClick(): void {
        openPopup({
            type: 'removeProposal',
        })
        modal.close()
    }

    async function updateIsVoting(): Promise<void> {
        try {
            isVotingForProposal = await isVotingForSelectedProposal()
        } catch (err) {
            handleError(err)
        }
    }

    function showTooltip(show: boolean): void {
        isTooltipVisible = isVotingForProposal !== undefined && show
    }

    onMount(() => void updateIsVoting())
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        {#if isBusy}
            <div class="flex items-center p-3 space-x-3 bg-gray-200">
                <Spinner busy width={16} height={16} />
                <Text type="p" secondary>{localize('views.governance.details.fetching')}</Text>
            </div>
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
                    disabled={isVotingForProposal}
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
