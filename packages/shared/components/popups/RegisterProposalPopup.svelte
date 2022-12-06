<script lang="typescript">
    import { Button, TextInput, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { registerParticipationEvent } from '@core/profile-manager/api'
    import { isValidUrl } from '@core/utils'
    import { handleError } from '@core/error/handlers/handleError'

    let eventId: string
    let nodeUrl: string

    let eventIdError: string
    let nodeUrlError: string

    function handleCancel(): void {
        closePopup()
    }

    async function handleConfirm(): Promise<void> {
        try {
            validate()
            await registerParticipationEvent(eventId, [{ url: nodeUrl }])
            closePopup()
        } catch (err) {
            handleError(err)
        }
    }

    function validate(): void {
        const isValid = isValidUrl(nodeUrl)
        if (!isValid) {
            nodeUrlError = localize('error.node.invalid')
            throw new Error(nodeUrlError)
        }
        const hasEventId = !!eventId
        if (!hasEventId) {
            eventIdError = 'Should have a valid event ID'
            throw new Error(eventIdError)
        }
    }
</script>

<register-proposal>
    <Text type={TextType.h3}>{localize('popups.registerProposal.title')}</Text>
    <Text bigger>{localize('popups.registerProposal.body')}</Text>
    <div class="flex flex-col w-full space-y-2 mt-4">
        <TextInput
            bind:value={eventId}
            bind:error={eventIdError}
            placeholder={localize('views.governance.details.proposalInformation.eventId')}
        />
        <TextInput
            bind:value={nodeUrl}
            bind:error={nodeUrlError}
            placeholder={localize('views.governance.details.proposalInformation.nodeUrl')}
        />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={handleCancel}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={handleConfirm}>{localize('actions.confirm')}</Button>
    </div>
</register-proposal>
