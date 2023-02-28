<script lang="ts">
    import { Button, ButtonVariant, HR } from '@ui'

    import { selectedAccount, setNextSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, nonHiddenActiveAccounts, updateActiveAccountMetadata } from '@core/profile'
    import { activeAccounts, visibleActiveAccounts } from '@core/profile/stores'

    import { closeDrawer, DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { Icon } from '@auxiliary/icon/enums'
    import features from '@features/features'

    const showDeleteAccount =
        $selectedAccount?.index === $activeAccounts?.length - 1 && $visibleActiveAccounts?.length > 1

    function _closeDrawer(): void {
        closeDrawer(DrawerId.AccountActions)
    }
    function handleCustomizeAccountClick(): void {
        openDrawer(DrawerId.CustomizeAccount)
        _closeDrawer()
    }
    function handleShowAccountClick(): void {
        updateActiveAccountMetadata($selectedAccount.index, { hidden: false })
        _closeDrawer()
    }
    function handleHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            updateActiveAccountMetadata($selectedAccount.index, { hidden: true })
            if (!$activeProfile.showHiddenAccounts) {
                setNextSelectedAccount()
            }
            _closeDrawer()
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
    }
    function handleDeleteAccountClick(): void {
        openDrawer(DrawerId.DeleteAccount, {
            title: localize('popups.deleteAccount.title', {
                values: { name: $selectedAccount?.name },
            }),
        })
        _closeDrawer()
    }
    function handleBalanceBreakdownClick(): void {
        openDrawer(DrawerId.BalanceBreakdown)
        _closeDrawer()
    }
</script>

<div class="flex flex-col space-y-4">
    {#if features?.dashboard?.accountActions?.balanceBreakdown?.enabled}
        <Button outline onClick={handleBalanceBreakdownClick} icon={Icon.Doc}>
            {localize('actions.viewBalanceBreakdown')}
        </Button>
    {/if}
    {#if features?.dashboard?.accountActions?.customize?.enabled}
        <Button outline onClick={handleCustomizeAccountClick} icon={Icon.Customize}>
            {localize('actions.customizeAcount')}
        </Button>
    {/if}
    {#if features?.dashboard?.accountActions?.toggleVisibility?.enabled}
        <Button
            outline
            disabled={!$selectedAccount.hidden && $nonHiddenActiveAccounts.length <= 1}
            onClick={() => ($selectedAccount.hidden ? handleShowAccountClick() : handleHideAccountClick())}
            icon={$selectedAccount.hidden ? Icon.View : Icon.Hide}
        >
            {localize($selectedAccount.hidden ? 'actions.showAccount' : 'actions.hideAccount')}
        </Button>
    {/if}
    {#if features?.dashboard?.accountActions?.delete?.enabled && showDeleteAccount}
        <HR />
        <Button
            variant={ButtonVariant.Warning}
            icon={Icon.Delete}
            disabled={!$selectedAccount.hidden && $nonHiddenActiveAccounts.length <= 1}
            onClick={handleDeleteAccountClick}
        >
            {localize('actions.deleteAccount')}
        </Button>
    {/if}
</div>
