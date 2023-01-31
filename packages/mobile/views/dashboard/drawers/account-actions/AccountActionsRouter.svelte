<script lang="typescript">
    import { Drawer, StrongholdUnlock } from '../../../../components'
    import { AccountActionsRoute, accountActionsRoute, accountActionsRouter } from '../../../../lib/routers'
    import {
        AccountActionsView,
        BalanceBreakdownView,
        ConsolidateConfirmationView,
        CustomizeAccountView,
        DeleteAccountConfirmationView,
    } from './views'

    export let onClose: () => unknown

    $: needsUnlockStore = $accountActionsRouter?.getNeedsUnlockStore()
    $: needsUnlockStoreCallbackStore = $accountActionsRouter?.getNeedsUnlockCallbackStore()
    function onUnlockSuccess(): void {
        $accountActionsRouter.setNeedsUnlock(false, undefined)
        if ($needsUnlockStoreCallbackStore && typeof $needsUnlockStoreCallbackStore === 'function') {
            $needsUnlockStoreCallbackStore()
        }
    }
</script>

{#if $accountActionsRoute === AccountActionsRoute.Actions}
    <AccountActionsView onToggleVisibilitySuccess={onClose} />
{:else if $accountActionsRoute === AccountActionsRoute.Customize}
    <CustomizeAccountView onSuccess={onClose} />
{:else if $accountActionsRoute === AccountActionsRoute.DeleteConfirmation}
    <DeleteAccountConfirmationView onSuccess={onClose} />
{:else if $accountActionsRoute === AccountActionsRoute.BalanceBreakdown}
    <BalanceBreakdownView />
{:else if $accountActionsRoute === AccountActionsRoute.ConsolidateConfirmation}
    <ConsolidateConfirmationView onSuccess={onClose} />
{/if}

{#if $needsUnlockStore}
    <Drawer onClose={() => $accountActionsRouter.setNeedsUnlock(false)}>
        <StrongholdUnlock
            onSuccess={onUnlockSuccess}
            onCancel={() => $accountActionsRouter.setNeedsUnlock(false, undefined)}
        />
    </Drawer>
{/if}
