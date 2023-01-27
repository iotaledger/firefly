<script lang="typescript">
    import { AccountActionsRoute, accountActionsRoute } from '../../../../lib/routers'
    import {
        AccountActionsView,
        CustomizeAccountView,
        DeleteAccountConfirmationView,
        BalanceBreakdownView,
    } from './views'

    export let onClose: () => unknown
</script>

{#if $accountActionsRoute === AccountActionsRoute.Actions}
    <AccountActionsView onToggleVisibilitySuccess={onClose} />
{:else if $accountActionsRoute === AccountActionsRoute.Customize}
    <CustomizeAccountView onSaveSucess={onClose} />
{:else if $accountActionsRoute === AccountActionsRoute.DeleteConfirmation}
    <DeleteAccountConfirmationView onDeleteSuccess={onClose} />
{:else if $accountActionsRoute === AccountActionsRoute.BalanceBreakdown}
    <BalanceBreakdownView />
{/if}
