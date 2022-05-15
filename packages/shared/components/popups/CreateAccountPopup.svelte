<script lang="typescript">
    import { Button, ColorPicker, Input, Spinner, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, popupState } from 'shared/lib/popup'
    import { isLedgerProfile } from '@core/profile'
    import { activeProfile } from '@core/profile'
    import { getRandomAccountColor, MAX_ACCOUNT_NAME_LENGTH } from '@core/account'
    import { tryCreateAdditionalAccount } from '@core/account'

    export let error = ''

    const { accounts } = $activeProfile

    let accountAlias = ''
    let isBusy = false
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

    function create() {
        tryCreateAdditionalAccount(trimmedAccountAlias, color.toString())
            .then(() => closePopup)
            .catch((error) => {
                isBusy = false
                if (error) {
                    console.error(error?.error || error)
                    if ($isLedgerProfile) {
                        displayNotificationForLedgerProfile('error', true, false, false, false, error)
                    } else {
                        showAppNotification({
                            type: 'error',
                            message: localize(error?.error || error),
                        })
                    }
                } else {
                    closePopup()
                }
            })
    }

    function cancel() {
        () => (isBusy = false)
    }

    const handleCreateClick = () => {
        const trimmedAccountAlias = accountAlias.trim()
        if (trimmedAccountAlias) {
            error = ''

            if (getTrimmedLength(trimmedAccountAlias) > MAX_ACCOUNT_NAME_LENGTH) {
                return (error = localize('error.account.length', {
                    values: {
                        length: MAX_ACCOUNT_NAME_LENGTH,
                    },
                }))
            }

            if ($accounts.find((a) => a.alias() === trimmedAccountAlias)) {
                return (error = localize('error.account.duplicate'))
            }

            isBusy = true

            if ($isLedgerProfile) {
                promptUserToConnectLedger(false, create, cancel)
            } else {
                create()
            }
        }
    }
    const handleCancelClick = () => {
        closePopup()
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
    <!-- Action -->
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
