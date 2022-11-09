<script lang="typescript">
    import { Platform } from '@core/app/classes'
    import { selectedAccount, setSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile/stores'
    import { deleteAccount } from '@core/profile-manager/actions'
    import { Icon } from '@lib/auxiliary/icon/enums'
    import { openPopup } from '@auxiliary/popup/actions'
    import { HR, MenuItem, Modal, ToggleHiddenAccountMenuItem } from 'shared/components'
    import { get } from 'svelte/store'
    import { AppContext } from '@core/app/enums'

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
                    Platform.resetRouterForAppContext(AppContext.Dashboard)
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
