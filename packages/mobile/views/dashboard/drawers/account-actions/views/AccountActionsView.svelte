<script lang="typescript">
    import { selectedAccount, setNextSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, nonHiddenActiveAccounts, updateActiveAccountMetadata } from '@core/profile'
    import features from '@features/features'
    import { Icon } from '@lib/auxiliary/icon/enums'
    import { Button } from '@ui'
    import { AccountAction } from '../../../../../lib/contexts/dashboard'
    import { accountActionsRouter } from '../../../../../lib/routers'

    export let onToggleVisibilitySuccess: () => unknown
    export let onDeleteSuccess: () => unknown

    function handleCustomizeAccountClick(): void {
        $accountActionsRouter.next({ action: AccountAction.Customize })
    }
    function handleShowAccountClick(): void {
        updateActiveAccountMetadata($selectedAccount.index, { hidden: false })
        onToggleVisibilitySuccess && onToggleVisibilitySuccess()
    }

    function handleHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            updateActiveAccountMetadata($selectedAccount.index, { hidden: true })
            if (!$activeProfile.showHiddenAccounts) {
                setNextSelectedAccount()
            }
            onDeleteSuccess && onDeleteSuccess()
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
    }
</script>

<div class="flex flex-col space-y-4">
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
</div>
