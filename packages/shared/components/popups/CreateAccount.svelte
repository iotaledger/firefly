<script lang="typescript">
    import { localize } from '@core/i18n'
    import { mobile, isKeyboardOpened, keyboardHeight, getKeyboardTransitionSpeed } from '@lib/app'
    import { getTrimmedLength } from '@lib/helpers'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from '@lib/ledger'
    import { showAppNotification } from '@lib/notifications'
    import { closePopup, popupState } from '@lib/popup'
    import { isLedgerProfile } from '@lib/profile'
    import { AccountColor } from '@lib/typings/color'
    import { createAccountCallback } from '@lib/typings/wallet'
    import { MAX_ACCOUNT_NAME_LENGTH, wallet } from '@lib/wallet'
    import { Button, ColorPicker, Input, Spinner, Text } from 'shared/components'

    export let error = ''
    export let onCreate: createAccountCallback
    export let onCancel = (): void => {}

    const { accounts } = $wallet

    let accountAlias = ''
    let isBusy = false
    let color = AccountColor.Blue

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
                        onCancel()
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
        onCancel()
    }
</script>

<div
    class="flex flex-col h-full justify-between"
    style="padding-bottom: {$mobile && $isKeyboardOpened
        ? $keyboardHeight
        : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened)} var(--transition-scroll)"
>
    <div>
        <div class="flex flex-row mb-6 {$mobile && 'w-full justify-center -mt-1'}">
            <Text type={$mobile ? 'h4' : 'h5'}>
                {localize('general.addAWallet')}
            </Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus={!$mobile}
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
        <div class="flex flex-row justify-between px-2 {$mobile && $isKeyboardOpened && '-mb-1'}">
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
