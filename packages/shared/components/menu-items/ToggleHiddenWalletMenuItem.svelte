<script lang="ts">
    import { selectedWallet, setNextSelectedWallet } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { activeProfile, nonHiddenActiveWallets, updateActiveWalletPersistedData } from '@core/profile'
    import { Icon } from '@lib/auxiliary/icon'
    import { MenuItem } from '@ui'

    export let onClick: () => unknown

    function onShowWalletClick(): void {
        if ($selectedWallet) {
            updateActiveWalletPersistedData($selectedWallet.id, { hidden: false })
            onClick && onClick()
        }
    }

    function onHideWalletClick(): void {
        if ($nonHiddenActiveWallets.length > 1) {
            if ($selectedWallet) {
                updateActiveWalletPersistedData($selectedWallet.id, { hidden: true })
                if (!$activeProfile.showHiddenWallets) {
                    setNextSelectedWallet()
                }
                onClick && onClick()
            }
        } else {
            console.error('Not enough wallets visible: ', $nonHiddenActiveWallets.length)
        }
    }
</script>

{#if $selectedWallet}
    <MenuItem
        icon={$selectedWallet.hidden ? Icon.View : Icon.Hide}
        title={localize($selectedWallet.hidden ? 'actions.showWallet' : 'actions.hideWallet')}
        onClick={() => ($selectedWallet.hidden ? onShowWalletClick() : onHideWalletClick())}
        disabled={!$selectedWallet.hidden && $nonHiddenActiveWallets.length <= 1}
        {...$$restProps}
    />
{/if}
