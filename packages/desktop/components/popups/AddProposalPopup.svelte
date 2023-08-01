<script lang="ts">
    import { showAppNotification } from '@auxiliary/notification/actions'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { registerProposalsForAccounts, registeredProposalsForSelectedAccount } from '@contexts/governance'
    import { selectedAccount } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { activeAccounts, updateActiveAccountPersistedData } from '@core/profile'
    import { truncateString } from '@core/utils/string'
    import type { Auth } from '@iota/wallet/out/types'
    import { Button, Checkbox, NodeInput, Text, TextInput, TextType } from 'shared/components'
    import { HTMLButtonType } from 'shared/components/enums'

    export let initialEventId: string
    export let initialNodeUrl: string

    let inputtedEventId = initialEventId
    let nodeUrl = initialNodeUrl
    let eventIdError: string
    let nodeInput: NodeInput
    let nodeInputError: string
    let isBusy = false
    let isRegisteringAllProposals = false
    let isAddingForAllAccounts = false

    $: isEditMode = !!initialEventId && !!initialNodeUrl
    $: disabled = isBusy || !nodeUrl || (!isRegisteringAllProposals && !eventId)
    $: eventId = inputtedEventId?.trim()

    function onCancelClick(): void {
        closePopup()
    }

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            await Promise.all([
                !isRegisteringAllProposals && validateEventId(!isAddingForAllAccounts && !isEditMode),
                nodeInput?.validate(),
            ])
            await registerParticipationWrapper()
            updateActiveAccountPersistedData($selectedAccount.index, {
                removedProposalIds: $selectedAccount.removedProposalIds?.filter((id) => id !== inputtedEventId),
            })
            isBusy = false
        } catch (err) {
            isBusy = false
            const isAuthenticationError = err?.error?.match(/(username)|(password)|(jwt)/g)?.length > 0
            const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
            const isNodeError = err?.error?.match(/(failed to lookup address information)|(dns error)/)?.length > 0
            if (isAuthenticationError) {
                openNodeAuthRequiredPopup()
            } else if (isEventError) {
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('error.governance.unableToAddProposal.long', {
                        values: { proposalId: truncateString(eventId) },
                    }),
                })
            } else if (isNodeError) {
                showAppNotification({
                    type: 'error',
                    alert: true,
                    message: localize('error.node.dns'),
                })
            } else if (!nodeInputError && !eventIdError) {
                handleError(err)
            }
        }
    }

    function openNodeAuthRequiredPopup(): void {
        openPopup({
            id: PopupId.NodeAuthRequired,
            props: { onSubmit: registerParticipationWrapper },
        })
    }

    async function registerParticipationWrapper(auth?: Auth): Promise<void> {
        const options = {
            node: { url: nodeUrl, auth },
            eventsToRegister: isRegisteringAllProposals ? [] : [eventId],
        }
        const accounts = isAddingForAllAccounts ? $activeAccounts : [$selectedAccount]
        await registerProposalsForAccounts(options, accounts)
        showAppNotification({
            type: 'success',
            message: generateSuccessMessage(),
            alert: true,
        })
        closePopup()
    }

    function generateSuccessMessage(): string {
        if (isEditMode) {
            return localize('views.governance.proposals.successEdit')
        } else {
            return localize(`views.governance.proposals.${isAddingForAllAccounts ? 'successAddAll' : 'successAdd'}`, {
                values: { numberOfProposals: isRegisteringAllProposals ? 'other' : 'one' },
            })
        }
    }

    async function validateEventId(checkIfAlreadyRegistered: boolean): Promise<void> {
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
        if (checkIfAlreadyRegistered && $registeredProposalsForSelectedAccount[eventId]) {
            eventIdError = localize('error.eventId.alreadyRegistered')
            return Promise.reject(eventIdError)
        }
    }
</script>

<form id="add-proposal" on:submit|preventDefault={onSubmit}>
    <Text type={TextType.h3} classes="mb-6"
        >{localize(`popups.${isEditMode ? 'editProposal' : 'addProposal'}.title`)}</Text
    >
    <Text fontSize="15">{localize(`popups.${isEditMode ? 'editProposal' : 'addProposal'}.body`)}</Text>
    <div class="flex flex-col w-full space-y-4 mt-4">
        <NodeInput bind:this={nodeInput} bind:nodeUrl bind:error={nodeInputError} />
        {#if !isEditMode}
            <Checkbox label="Add all proposals on this node" bind:checked={isRegisteringAllProposals} />
        {/if}
        <TextInput
            bind:value={inputtedEventId}
            bind:error={eventIdError}
            disabled={isRegisteringAllProposals || isEditMode}
            placeholder={localize('views.governance.details.proposalInformation.eventId')}
            label={localize('views.governance.details.proposalInformation.eventId')}
        />
        {#if !isEditMode}
            <Checkbox label={localize('popups.addProposal.addToAllAccounts')} bind:checked={isAddingForAllAccounts} />
        {/if}
    </div>
    <div class="flex w-full space-x-4 mt-6">
        <Button outline classes="w-full" onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button type={HTMLButtonType.Submit} {disabled} {isBusy} classes="w-full">
            {localize('actions.confirm')}
        </Button>
    </div>
</form>
