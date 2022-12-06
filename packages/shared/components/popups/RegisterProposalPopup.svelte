<script lang="typescript">
    import { Button, TextInput, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { registerParticipationEvent } from '@core/profile-manager/api'
    import { isValidUrl } from '@core/utils'

    let eventId: string
    let nodeUrl: string

    let eventIdError: string
    let nodeUrlError: string

    function handleCancel(): void {
        closePopup()
    }

    async function handleConfirm(): Promise<void> {
        const isValid = isValidUrl(nodeUrl)
        if (isValid) {
            await registerParticipationEvent(eventId, [{ url: nodeUrl }])
            closePopup()
        } else {
            nodeUrlError = localize('error.node.invalid')
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
