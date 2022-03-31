<script lang="typescript">
    import { AccountTile, Button, ColorPicker, Input, Spinner, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, popupState } from 'shared/lib/popup'
    import { isLedgerProfile } from 'shared/lib/profile'
    import { AccountColors, MAX_ACCOUNT_NAME_LENGTH, wallet } from 'shared/lib/wallet'
    import { formatCurrency } from 'shared/lib/currency'

    export let error = ''
    export let onCreate = (..._: any[]): void => {}

    const { accounts } = $wallet

    let accountAlias = ''
    let isBusy = false
    let color = AccountColors.Blue

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

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

            if ($accounts.find((a) => a.alias === trimmedAccountAlias)) {
                return (error = localize('error.account.duplicate'))
            }

            isBusy = true

            const _cancel = () => (isBusy = false)
            const _create = () =>
                onCreate(trimmedAccountAlias, color, (err) => {
                    isBusy = false

                    if (err) {
                        console.error(err?.error || err)

                        if ($isLedgerProfile) {
                            displayNotificationForLedgerProfile('error', true, false, false, false, err)
                        } else {
                            showAppNotification({
                                type: 'error',
                                message: localize(err?.error || err),
                            })
                        }
                    } else {
                        closePopup()
                    }
                })

            if ($isLedgerProfile) {
                promptUserToConnectLedger(false, _create, _cancel)
            } else {
                _create()
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
            <AccountTile
                balance={'0 Mi'}
                balanceEquiv={formatCurrency(0)}
                {color}
                name={accountAlias || localize('general.accountName')}
                classes="mb-4"
            />
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
