<script lang="typescript">
    import { Button, ColorPicker, Input, Spinner, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { getRandomAccountColor, tryCreateAdditionalAccount, validateAccountName } from '@core/account'

    export let error = ''

    const { isStrongholdLocked } = $activeProfile

    let isBusy = false
    let accountAlias = ''
    let color = getRandomAccountColor()

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')
    $: trimmedAccountAlias = accountAlias.trim()

    $: {
        /**
         * CAUTION: isBusy becomes true whenever the Stronghold password popup
         * becomes active (by Wallet.svelte), so we must be sure that it gets
         * set to false again in case the user cancels the popup. This is safe
         * because it's within a reactive dependency.
         */
        if (!$popupState.active) {
            isBusy = false
        }
    }

    async function handleCreateClick(): Promise<void> {
        if (trimmedAccountAlias) {
            error = ''
            try {
                await validateAccountName(trimmedAccountAlias)
            } catch ({ message }) {
                error = message
                return
            }

            isBusy = true

            if ($isLedgerProfile) {
                void promptUserToConnectLedger(false, _create, _cancel)
            } else if ($isSoftwareProfile && $isStrongholdLocked) {
                openPopup({ type: 'password', props: { onSuccess: _create } })
            } else {
                void _create()
            }
        }
    }

    function handleCancelClick(): void {
        closePopup()
    }

    async function _create(): Promise<void> {
        try {
            if (trimmedAccountAlias || color) {
                await tryCreateAdditionalAccount(trimmedAccountAlias, color.toString())
                closePopup()
            }
        } finally {
            isBusy = false
        }
    }

    function _cancel(): void {
        isBusy = false
    }
</script>

<div class="flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{localize('general.createNewWallet')}</Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={handleCreateClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    {#if isBusy && !error}
        <Spinner busy={true} message={localize('general.creatingAccount')} classes="justify-center h-12" />
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>
                {localize('actions.cancel')}
            </Button>
            <Button
                disabled={!getTrimmedLength(accountAlias) || isBusy}
                classes="-mx-2 w-1/2"
                onClick={() => handleCreateClick()}
            >
                {localize('actions.create')}
            </Button>
        </div>
    {/if}
</div>
