<script lang="ts">
    import { MenuItem, MenuItemVariant, Modal, ToggleHiddenAccountMenuItem } from '@ui'

    import { localize } from '@core/i18n'
    import { activeProfile, isActiveLedgerProfile } from '@core/profile/stores'

    import { Icon } from '@auxiliary/icon/enums'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { checkOrConnectLedger } from '@core/ledger'
    import { showAppNotification } from '@auxiliary/notification'
    import { handleError } from '@core/error/handlers'
    import { NetworkId } from '@core/network/enums'
    import { selectedWallet } from '@core/wallet/stores'
    import { activeProfileSecretManager } from '@core/secret-manager'
    import { deleteWallet } from '@core/profile'

    export let modal: Modal = undefined

    const showDeleteAccount = true // TODO(2.0) Is there anything preventing us from deleting any account ?
    // $selectedWallet?.id === $activeWallets?.length - 1 && $visibleActiveWallets?.length > 1

    function onCustomiseAccountClick(): void {
        openPopup({ id: PopupId.ManageWallet })
        modal?.close()
    }

    function onViewBalanceClick(): void {
        openPopup({ id: PopupId.BalanceBreakdown })
        modal?.close()
    }

    function onViewAddressHistoryClick(): void {
        openPopup({ id: PopupId.AddressHistory })
        modal?.close()
    }

    function onVerifyAddressClick(): void {
        const ADDRESS_INDEX = 0
        checkOrConnectLedger(() => {
            try {
                if ($activeProfileSecretManager && $selectedWallet && $isActiveLedgerProfile) {
                    $activeProfileSecretManager.generateEd25519Addresses({
                        accountIndex: ADDRESS_INDEX, // TODO(2.0) This shouldn't be named accountIndex
                        options: {
                            internal: false,
                            ledgerNanoPrompt: true,
                        },
                    })
                    showAppNotification({
                        type: 'info',
                        message: localize('general.verifyLedgerDepositAddress'),
                    })
                }
            } catch (err) {
                handleError(err)
            } finally {
                modal?.close()
            }
            return Promise.resolve()
        })
    }

    function onDeleteAccountClick(): void {
        openPopup({
            id: PopupId.DeleteAccount,
            props: {
                account: selectedWallet,
                deleteWallet,
            },
        })
        modal?.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <account-actions-menu class="flex flex-col">
        <MenuItem icon={Icon.Doc} title={localize('actions.viewBalanceBreakdown')} onClick={onViewBalanceClick} />
        {#if $activeProfile?.network?.id === NetworkId.Iota}
            <MenuItem
                icon={Icon.Timer}
                title={localize('actions.viewAddressHistory')}
                onClick={onViewAddressHistoryClick}
            />
        {/if}
        <MenuItem icon={Icon.Customize} title={localize('actions.customizeAcount')} onClick={onCustomiseAccountClick} />
        {#if $isActiveLedgerProfile}
            <MenuItem
                icon={Icon.Ledger}
                title={localize('actions.verifyDepositAddress')}
                onClick={onVerifyAddressClick}
            />
        {/if}
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
