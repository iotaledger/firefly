<script lang="ts">
    import { MenuItem, MenuItemVariant, Modal, ToggleHiddenAccountMenuItem } from '@ui'

    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeAccounts, isActiveLedgerProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { deleteAccount } from '@core/profile-manager/actions'

    import { Icon } from '@auxiliary/icon/enums'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { profileManager } from '@core/profile-manager'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { showAppNotification } from '@auxiliary/notification'

    export let modal: Modal = undefined

    let error = ''

    const showDeleteAccount =
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    function onCustomiseAccountClick(): void {
        openPopup({ id: PopupId.ManageAccount })
        modal?.close()
    }

    function onViewBalanceClick(): void {
        openPopup({ id: PopupId.BalanceBreakdown })
        modal?.close()
    }

    function onVerifyAddressClick(): void {
        const ADDRESS_INDEX = 0
        try {
            error = ''
            if ($profileManager && $selectedAccount) {
                if ($isActiveLedgerProfile && !$ledgerNanoStatus.connected) {
                    displayNotificationForLedgerProfile('warning')
                    return
                }
                $profileManager.generateEd25519Address($selectedAccount.index, ADDRESS_INDEX, {
                    internal: false,
                    ledgerNanoPrompt: true,
                })
                showAppNotification({
                    type: 'info',
                    message: localize('views.generateNewLedgerAddress.confirmedBody'),
                })
            }
        } catch (err) {
            error = localize(err.error)

            if ($isActiveLedgerProfile) {
                displayNotificationForLedgerProfile('error', true, true, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(err.error),
                })
            }
        } finally {
            modal?.close()
        }
    }

    function onDeleteAccountClick(): void {
        openPopup({
            id: PopupId.DeleteAccount,
            props: {
                account: selectedAccount,
                deleteAccount,
            },
        })
        modal?.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <account-actions-menu class="flex flex-col">
        <MenuItem icon={Icon.Doc} title={localize('actions.viewBalanceBreakdown')} onClick={onViewBalanceClick} />
        <MenuItem icon={Icon.Ledger} title={localize('actions.verifyAddress')} onClick={onVerifyAddressClick} />
        <MenuItem icon={Icon.Customize} title={localize('actions.customizeAcount')} onClick={onCustomiseAccountClick} />
        <ToggleHiddenAccountMenuItem onClick={modal?.close} />
        <hr />
        {#if showDeleteAccount}
            <MenuItem
                icon={Icon.Delete}
                title={localize('actions.deleteAccount')}
                onClick={onDeleteAccountClick}
                variant={MenuItemVariant.Error}
            />
        {/if}
    </account-actions-menu>
</Modal>
