<script lang="typescript">
    import { selectedAccount, setNextSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, nonHiddenActiveAccounts, updateActiveAccountMetadata } from '@core/profile'
    import { Icon } from '@lib/auxiliary/icon'
    import { MenuItem } from 'shared/components'

    export let onClick: () => unknown

    function handleShowAccountClick(): void {
        updateActiveAccountMetadata($selectedAccount.index, { hidden: false })
        onClick && onClick()
    }

    function handleHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            updateActiveAccountMetadata($selectedAccount.index, { hidden: true })
            if (!$activeProfile.showHiddenAccounts) {
                setNextSelectedAccount()
            }
            onClick && onClick()
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
    }
</script>

<MenuItem
    icon={$selectedAccount.hidden ? Icon.View : Icon.Hide}
    title={localize($selectedAccount.hidden ? 'actions.showAccount' : 'actions.hideAccount')}
    onClick={() => ($selectedAccount.hidden ? handleShowAccountClick() : handleHideAccountClick())}
    disabled={!$selectedAccount.hidden && $nonHiddenActiveAccounts.length <= 1}
    {...$$restProps}
/>
