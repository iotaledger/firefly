<script lang="ts">
    import { selectedWallet, setNextSelectedWallet } from '@core/account'
    import { localize } from '@core/i18n'
    import { activeProfile, nonHiddenActiveAccounts } from '@core/profile'
    import { updateActiveAccountPersistedData } from '@core/profile/actions'
    import { Icon } from '@lib/auxiliary/icon'
    import { MenuItem } from '@ui'

    export let onClick: () => unknown

    function onShowAccountClick(): void {
        if ($selectedWallet) {
            updateActiveAccountPersistedData($selectedWallet.index, { hidden: false })
            onClick && onClick()
        }
    }

    function onHideAccountClick(): void {
        if ($nonHiddenActiveAccounts.length > 1) {
            if ($selectedWallet) {
                updateActiveAccountPersistedData($selectedWallet.index, { hidden: true })
                if (!$activeProfile.showHiddenAccounts) {
                    setNextSelectedWallet()
                }
                onClick && onClick()
            }
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveAccounts.length)
        }
    }
</script>

{#if $selectedWallet}
    <MenuItem
        icon={$selectedWallet.hidden ? Icon.View : Icon.Hide}
        title={localize($selectedWallet.hidden ? 'actions.showAccount' : 'actions.hideAccount')}
        onClick={() => ($selectedWallet.hidden ? onShowAccountClick() : onHideAccountClick())}
        disabled={!$selectedWallet.hidden && $nonHiddenActiveAccounts.length <= 1}
        {...$$restProps}
    />
{/if}
