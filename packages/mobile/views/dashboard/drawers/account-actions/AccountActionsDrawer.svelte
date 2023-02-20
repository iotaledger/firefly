<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { Drawer } from '../../../../components'
    import { AccountActionsRoute, accountActionsRoute, accountActionsRouter } from '../../../../lib/routers'
    import AccountActionsRouter from './AccountActionsRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string

    $: $accountActionsRoute, setTitle()

    function setTitle(): void {
        switch ($accountActionsRoute) {
            case AccountActionsRoute.Actions:
                title = null
                break
            case AccountActionsRoute.Customize:
                title = localize('general.manageAccount')
                break
            case AccountActionsRoute.DeleteConfirmation:
                title = localize('popups.deleteAccount.title', {
                    values: { name: $selectedAccount?.name },
                })
                break
            case AccountActionsRoute.BalanceBreakdown:
                title = localize('popups.balanceBreakdown.title')
                break
            case AccountActionsRoute.ConsolidateConfirmation:
                title = localize('popups.minimizeStorageDeposit.title')
                break
        }
    }
</script>

<Drawer
    {onClose}
    {title}
    allowBack={$accountActionsRoute !== AccountActionsRoute.Actions}
    onBackClick={() => $accountActionsRouter.previous()}
>
    <AccountActionsRouter {onClose} />
</Drawer>
