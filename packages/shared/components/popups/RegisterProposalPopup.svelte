<script lang="typescript">
    import { Button, TextInput, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { registerParticipationEvent } from '@core/profile-manager/api'
    import { isValidUrl } from '@core/utils'
    import { handleError } from '@core/error/handlers/handleError'
    import { showAppNotification } from '@auxiliary/notification'

    let eventId: string
    let nodeUrl: string

    let eventIdError: string
    let nodeUrlError: string

    $: disabled = !eventId || !nodeUrl

    function handleCancel(): void {
        closePopup()
    }

    async function handleConfirm(): Promise<void> {
        try {
            await Promise.all([validateEventId(), validateNodeUrl()])
            await registerParticipationEvent(eventId, [{ url: nodeUrl }])
            showAppNotification({
                type: 'success',
                message: localize('views.governance.proposals.successRegister'),
            })
            closePopup()
        } catch (err) {
            if (!nodeUrlError && !eventIdError) {
                handleError(err)
            }
        }
    }

    async function validateNodeUrl(): Promise<void> {
        if (!isValidUrl(nodeUrl)) {
            nodeUrlError = localize('error.node.invalid')
            return Promise.reject(nodeUrlError)
        }
    }

    async function validateEventId(): Promise<void> {
        const startsWith0x = eventId?.substring(0, 2) === '0x'
        if (!startsWith0x) {
            eventIdError = localize('error.eventId.doesNotStartWith0x')
            return Promise.reject(eventIdError)
        }

        const hexLength = eventId?.substring(2)?.length
        const has64Length = hexLength === 64
        if (!has64Length) {
            eventIdError = localize('error.eventId.insufficientLength')
            return Promise.reject(eventIdError)
        }
    }
</script>

<register-proposal>
    <Text type={TextType.h3} classes="mb-6">{localize('popups.registerProposal.title')}</Text>
    <Text fontSize="15">{localize('popups.registerProposal.body')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-4">
        <TextInput
            bind:value={eventId}
            bind:error={eventIdError}
            placeholder={localize('views.governance.details.proposalInformation.eventId')}
            label={localize('views.governance.details.proposalInformation.eventId')}
        />
        <TextInput
            bind:value={nodeUrl}
            bind:error={nodeUrlError}
            placeholder={localize('views.governance.details.proposalInformation.nodeUrl')}
            label={localize('views.governance.details.proposalInformation.nodeUrl')}
        />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={handleCancel}>{localize('actions.cancel')}</Button>
        <Button {disabled} classes="w-full" onClick={handleConfirm}>{localize('actions.confirm')}</Button>
    </div>
</register-proposal>
