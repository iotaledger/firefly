<script lang="typescript">
    import { Button, HTMLButtonType, Spinner, TextInput, Text, TextType } from 'shared/components'
    import type { Auth } from '@iota/wallet'
    import { showAppNotification } from '@auxiliary/notification/actions'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { registerParticipationEvent } from '@core/profile-manager/api'
    import { truncateString } from '@core/utils/string'
    import { isValidUrl } from '@core/utils/validation'

    export let eventId: string
    export let nodeUrl: string

    let eventIdError: string
    let nodeUrlError: string

    let busy = false

    $: disabled = !eventId || !nodeUrl

    function onCloseClick(): void {
        closePopup()
    }

    async function onConfirmClick(): Promise<void> {
        try {
            busy = true

            await Promise.all([validateEventId(), validateNodeUrl()])
            await registerParticipationWrapper()

            busy = false
        } catch (err) {
            busy = false
            const isAuthenticationError = err?.error?.match(/(username)|(password)|(jwt)/g)?.length > 0
            const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
            const isNodeError = err?.error?.match(/(failed to lookup address information)|(dns error)/)?.length > 0
            if (isAuthenticationError) {
                openNodeAuthRequiredPopup()
            } else if (isEventError) {
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('error.governance.unableToRegisterProposal.long', {
                        values: { proposalId: truncateString(eventId) },
                    }),
                })
            } else if (isNodeError) {
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('error.node.dns'),
                })
            } else if (!nodeUrlError && !eventIdError) {
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

<form id="register-proposal" on:submit|preventDefault={onConfirmClick}>
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
        <Button outline classes="w-full" onClick={onCloseClick}>{localize('actions.cancel')}</Button>
        <Button disabled={disabled || busy} classes="w-full" type={HTMLButtonType.Submit}>
            {#if busy}
                <Spinner {busy} />
            {:else}
                {localize('actions.confirm')}
            {/if}
        </Button>
    </div>
</form>
