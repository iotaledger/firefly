<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification'
    import { ProposalStatus } from '@contexts/governance/enums'
    import {
        clearSelectedParticipationEventStatus,
        removePersistedProposal,
        selectedProposal,
        selectedProposalId,
    } from '@contexts/governance/stores'
    import { closePopup } from '@auxiliary/popup'
    import { selectedAccount } from '@core/account/stores'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { governanceRouter } from '@core/router'
    import { Button, Text, TextHint, TextType } from 'shared/components'
    import { ButtonVariant } from 'shared/components/enums'

    function onCancelClick(): void {
        closePopup()
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await $selectedAccount.deregisterParticipationEvent($selectedProposalId)
            updateActiveAccountPersistedData($selectedAccount.index, {
                removedProposalIds: [...($selectedAccount.removedProposalIds ?? []), $selectedProposalId],
            })
            $governanceRouter.previous()
            clearEvent()
            closePopup()
            showAppNotification({
                type: 'success',
                message: localize('views.governance.proposals.successRemove'),
                alert: true,
            })
        } catch (err) {
            handleError(err)
        }
    }

    function clearEvent(): void {
        removePersistedProposal($selectedProposalId, $selectedAccount.index)
        $selectedProposalId = null
        clearSelectedParticipationEventStatus()
    }

    // TODO: User can only remove a proposal when he is not voting for it
    $: isTextHintVisible =
        $selectedProposal?.status === ProposalStatus.Commencing || $selectedProposal?.status === ProposalStatus.Holding
</script>

<remove-proposal>
    <Text type={TextType.h3}>{localize('popups.removeProposal.title')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-6">
        <Text fontSize="15">{localize('popups.removeProposal.body')}</Text>
        {#if isTextHintVisible}
            <TextHint info text={localize('popups.removeProposal.hint')} />
        {/if}
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button variant={ButtonVariant.Warning} classes="w-full" onClick={onConfirmClick}
            >{localize('actions.remove')}</Button
        >
    </div>
</remove-proposal>
