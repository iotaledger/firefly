<script lang="ts">
    import { selectedWallet, setNextSelectedWallet } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { activeProfile, nonHiddenActiveWallets, updateActiveWalletPersistedData } from '@core/profile'
    import { Icon } from '@lib/auxiliary/icon'
    import { MenuItem } from '@ui'

    export let onClick: () => unknown

    function onShowAccountClick(): void {
        if ($selectedWallet) {
            updateActiveWalletPersistedData($selectedWallet.id, { hidden: false })
            onClick && onClick()
        }
    }

    function onHideAccountClick(): void {
        if ($nonHiddenActiveWallets.length > 1) {
            if ($selectedWallet) {
                updateActiveWalletPersistedData($selectedWallet.id, { hidden: true })
                if (!$activeProfile.showHiddenAccounts) {
                    setNextSelectedWallet()
                }
                onClick && onClick()
            }
        } else {
            console.error('Not enough accounts visible: ', $nonHiddenActiveWallets.length)
        }
    }
</script>

{#if $selectedWallet}
    <MenuItem
        icon={$selectedWallet.hidden ? Icon.View : Icon.Hide}
        title={localize($selectedWallet.hidden ? 'actions.showAccount' : 'actions.hideAccount')}
        onClick={() => ($selectedWallet.hidden ? onShowAccountClick() : onHideAccountClick())}
        disabled={!$selectedWallet.hidden && $nonHiddenActiveWallets.length <= 1}
        {...$$restProps}
    />
{/if}
