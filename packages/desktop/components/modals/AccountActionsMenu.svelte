<script lang="ts">
    import { MenuItem, MenuItemVariant, Modal, ToggleHiddenAccountMenuItem } from '@ui'

    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { activeAccounts, activeProfile, isActiveLedgerProfile, visibleActiveAccounts } from '@core/profile/stores'
    import { deleteAccount } from '@core/profile-manager/actions'

    import { Icon } from '@auxiliary/icon/enums'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { profileManager } from '@core/profile-manager'
    import { checkOrConnectLedger } from '@core/ledger'
    import { showAppNotification } from '@auxiliary/notification'
    import { handleError } from '@core/error/handlers'
    import { NetworkId } from '@core/network/enums'

    export let modal: Modal = undefined

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

    function onViewAddressHistoryClick(): void {
        openPopup({ id: PopupId.AddressHistory })
        modal?.close()
    }

    function onWithdrawFromL2Click(): void {
        openPopup({ id: PopupId.WithdrawFromL2 })
        modal?.close()
    }

    function onVerifyAddressClick(): void {
        const ADDRESS_INDEX = 0
        checkOrConnectLedger(() => {
            try {
                if ($profileManager && $selectedAccount && $isActiveLedgerProfile) {
                    $profileManager.generateEd25519Address($selectedAccount.index, ADDRESS_INDEX, {
                        internal: false,
                        ledgerNanoPrompt: true,
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
        {#if $activeProfile?.network?.id === NetworkId.Iota || $activeProfile?.network?.id === NetworkId.IotaAlphanet}
            <MenuItem
                icon={Icon.Timer}
                title={localize('actions.viewAddressHistory')}
                onClick={onViewAddressHistoryClick}
            />
        {/if}
        {#if $activeProfile?.network?.id === NetworkId.Shimmer || $activeProfile?.network?.id === NetworkId.ShimmerTestnet || $activeProfile?.network?.id === NetworkId.IotaTestnet || $activeProfile?.network?.id === NetworkId.Iota}
            <MenuItem icon={Icon.Transfer} title={localize('actions.withdrawFromL2')} onClick={onWithdrawFromL2Click} />
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
