<script lang="typescript">
    import { selectedAccount, setSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile'
    import { deleteAccount } from '@core/profile-manager'
    import { Icon } from '@lib/auxiliary/icon'
    import { openPopup } from '@auxiliary/popup'
    import { HR, MenuItem, Modal, ToggleHiddenAccountMenuItem } from 'shared/components'
    import { get } from 'svelte/store'
    import { resetWalletRoute } from '../../lib/core/router'

    export let modal: Modal = undefined

    const showDeleteAccount =
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    function handleCustomiseAccountClick(): void {
        openPopup({ type: 'manageAccount' })
        modal.close()
    }

    function handleViewStorageDepositClick(): void {
        openPopup({ type: 'storageDepositBreakdown' })
        modal.close()
    }

    function handleDeleteAccountClick(): void {
        openPopup({
            type: 'deleteAccount',
            props: {
                account: selectedAccount,
                deleteAccount: async (index: number) => {
                    await deleteAccount(index)
                    setSelectedAccount(get(visibleActiveAccounts)?.[0]?.index ?? null)
                    resetWalletRoute()
                },
            },
        })
        modal.close()
    }
</script>

<Modal bind:this={modal} position={{ top: '52px', right: '24px' }}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Doc}
            title={localize('actions.viewStorageDeposit')}
            onClick={handleViewStorageDepositClick}
        />
        <MenuItem
            icon={Icon.Customize}
            title={localize('actions.customizeAcount')}
            onClick={handleCustomiseAccountClick}
        />
        <ToggleHiddenAccountMenuItem onClick={() => modal.close()} />
        <HR />
        {#if showDeleteAccount}
            <MenuItem
                icon={Icon.Delete}
                title={localize('actions.deleteAccount')}
                onClick={handleDeleteAccountClick}
                variant="error"
            />
        {/if}
    </div>
</Modal>
