<script lang="ts">
    import { selectedAccount, setNextSelectedAccount, updateSelectedAccountPersistedData } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, nonHiddenActiveAccounts } from '@core/profile'
    import { Icon } from '@lib/auxiliary/icon'
    import { MenuItem } from '@ui'

    export let onClick: () => unknown

    function onShowAccountClick(): void {
        if ($selectedAccount) {
            updateSelectedAccountPersistedData($selectedAccount.index, { hidden: false })
            onClick && onClick()
        }
    }

    function onHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            if ($selectedAccount) {
                updateSelectedAccountPersistedData($selectedAccount.index, { hidden: true })
                if (!$activeProfile.showHiddenAccounts) {
                    setNextSelectedAccount()
                }
                onClick && onClick()
            }
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
    }
</script>

{#if $selectedAccount}
    <MenuItem
        icon={$selectedAccount.hidden ? Icon.View : Icon.Hide}
        title={localize($selectedAccount.hidden ? 'actions.showAccount' : 'actions.hideAccount')}
        onClick={() => ($selectedAccount.hidden ? onShowAccountClick() : onHideAccountClick())}
        disabled={!$selectedAccount.hidden && $nonHiddenActiveAccounts.length <= 1}
        {...$$restProps}
    />
{/if}
