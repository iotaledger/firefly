<script lang="typescript">
    import type { Auth } from '@iota/wallet'
    import { Button, NodeInput, TextInput, Text, TextType } from 'shared/components'
    import { HTMLButtonType } from 'shared/components/enums'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { registerParticipationEvent } from '@core/profile-manager/api'
    import { showAppNotification } from '@auxiliary/notification/actions'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'

    export let eventId: string
    export let nodeUrl: string

    let eventIdError: string
    let nodeInput: NodeInput

    $: disabled = !eventId || !nodeUrl

    function handleCancel(): void {
        closePopup()
    }

    async function handleSubmit(): Promise<void> {
        try {
            await Promise.all([validateEventId(), nodeInput?.validate()])
            await registerParticipationWrapper()
        } catch (err) {
            const isAuthenticationError = err?.error?.match(/(username)|(password)|(jwt)/g).length > 0
            if (isAuthenticationError) {
                openNodeAuthRequiredPopup()
            } else if (!nodeInput?.error && !eventIdError) {
                handleError(err)
            }
        }
    }

    function openNodeAuthRequiredPopup(): void {
        openPopup({
            type: 'nodeAuthRequired',
            props: { onSubmit: registerParticipationWrapper },
        })
    }

    async function registerParticipationWrapper(auth?: Auth): Promise<void> {
        await registerParticipationEvent(eventId, [{ url: nodeUrl, auth }])
        showAppNotification({
            type: 'success',
            message: localize('views.governance.proposals.successRegister'),
            alert: true,
        })
        closePopup()
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

<form id="register-proposal" on:submit|preventDefault={handleSubmit}>
    <Text type={TextType.h3} classes="mb-6">{localize('popups.registerProposal.title')}</Text>
    <Text fontSize="15">{localize('popups.registerProposal.body')}</Text>
    <div class="flex flex-col w-full space-y-4 mt-4">
        <TextInput
            bind:value={eventId}
            bind:error={eventIdError}
            placeholder={localize('views.governance.details.proposalInformation.eventId')}
            label={localize('views.governance.details.proposalInformation.eventId')}
        />
        <NodeInput bind:this={nodeInput} bind:nodeUrl />
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={handleCancel}>{localize('actions.cancel')}</Button>
        <Button type={HTMLButtonType.Submit} {disabled} classes="w-full">{localize('actions.confirm')}</Button>
    </div>
</form>
