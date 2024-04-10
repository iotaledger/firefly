<script lang="ts">
    import { MenuItem, MenuItemVariant, Modal, ToggleHiddenWalletMenuItem } from '@ui'

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

    const showDeleteWallet = false // TODO(2.0) It doesn't make sense to allow removing
    // the wallet as there is only one for each profile at the moment

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

    function onDeleteWalletClick(): void {
        openPopup({
            id: PopupId.DeleteWallet,
            props: {
                wallet: selectedWallet,
                deleteWallet,
            },
        })
        modal?.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <wallet-actions-menu class="flex flex-col">
        <MenuItem icon={Icon.Doc} title={localize('actions.viewBalanceBreakdown')} onClick={onViewBalanceClick} />
        {#if $activeProfile?.network?.id === NetworkId.Iota || $activeProfile?.network?.id === NetworkId.IotaAlphanet}
            <MenuItem
                icon={Icon.Timer}
                title={localize('actions.viewAddressHistory')}
                onClick={onViewAddressHistoryClick}
            />
        {/if}
        {#if $activeProfile?.network?.id === NetworkId.Shimmer || $activeProfile?.network?.id === NetworkId.Testnet}
            <MenuItem icon={Icon.Transfer} title={localize('actions.withdrawFromL2')} onClick={onWithdrawFromL2Click} />
        {/if}
        {#if $isActiveLedgerProfile}
            <MenuItem
                icon={Icon.Ledger}
                title={localize('actions.verifyDepositAddress')}
                onClick={onVerifyAddressClick}
            />
        {/if}
        <ToggleHiddenWalletMenuItem onClick={modal?.close} />
        <hr />
        {#if showDeleteWallet}
            <MenuItem
                icon={Icon.Delete}
                title={localize('actions.showDeleteWallet')}
                onClick={onDeleteWalletClick}
                variant={MenuItemVariant.Error}
            />
        {/if}
    </wallet-actions-menu>
</Modal>
