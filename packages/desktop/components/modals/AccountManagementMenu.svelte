<script lang="ts">
    import { MenuItem, Modal } from '@ui'
    import { localize } from '@core/i18n'
    import { Icon } from '@auxiliary/icon/enums'
    import { updateActiveWallet, updateActiveWalletPersistedData } from '@core/profile'
    import { AddressConverter, selectedWallet, selectedWalletId } from '@core/wallet'
    import { openPopup, PopupId } from '@auxiliary/popup'
    import { AccountAddress } from '@iota/sdk/out/types'

    export let modal: Modal = undefined
    export let accountId: string
    export let keys: string[] = []

    function setAsMainAccount(): void {
        updateActiveWalletPersistedData($selectedWalletId, {
            mainAccountId: accountId,
        })
        updateActiveWallet($selectedWalletId, {
            depositAddress: AddressConverter.addressToBech32(new AccountAddress(accountId)),
        })
        modal?.close()
    }

    function manageKeys(): void {
        openPopup({ id: PopupId.ManageKeys, props: { keys } })
        modal?.close()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <account-management-menu class="flex flex-col">
        <MenuItem
            icon={Icon.Key}
            title={localize('views.accountManagement.details.modal.manageKeys')}
            onClick={manageKeys}
        />
        <MenuItem
            icon={Icon.Star}
            title={localize('views.accountManagement.details.modal.setMainAccount')}
            onClick={setAsMainAccount}
            disabled={accountId === $selectedWallet.mainAccountId ||
                $selectedWallet?.balances?.blockIssuanceCredits[accountId] < 0}
        />
    </account-management-menu>
</Modal>
