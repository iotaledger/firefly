<script lang="typescript">
    import { Button, Text, TextType, TextHint } from 'shared/components'
    import { ButtonVariant } from 'shared/components/enums'
    import { handleError } from '@core/error/handlers/handleError'
    import { selectedProposal } from '@core/governance'
    import { localize } from '@core/i18n'
    import { deregisterParticipationEvent } from '@core/profile-manager/api'
    import { GovernanceRoute, governanceRouter } from '@core/router'
    import { closePopup } from '@auxiliary/popup'
    import { showAppNotification } from '@auxiliary/notification'

    function handleCancel(): void {
        closePopup()
    }

    async function handleConfirm(): Promise<void> {
        try {
            await deregisterParticipationEvent($selectedProposal.id)
            showAppNotification({
                type: 'success',
                message: localize('views.governance.proposals.successRemove'),
                alert: true,
            })
            closePopup()
            $governanceRouter.goTo(GovernanceRoute.Proposals)
        } catch (err) {
            handleError(err)
        }
    }

    // TODO: User can only remove a proposal when he is not voting for it
</script>

<remove-proposal>
    <Text type={TextType.h3}>{localize('popups.removeProposal.title')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-6">
        <Text fontSize="15">{localize('popups.removeProposal.body')}</Text>
        <TextHint info text={localize('popups.removeProposal.hint')} />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={handleCancel}>{localize('actions.cancel')}</Button>
        <Button variant={ButtonVariant.Warning} classes="w-full" onClick={handleConfirm}
            >{localize('actions.remove')}</Button
        >
    </div>
</remove-proposal>
