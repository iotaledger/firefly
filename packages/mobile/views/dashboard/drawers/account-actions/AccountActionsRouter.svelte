<script lang="typescript">
    import { AccountActionsRoute, accountActionsRoute } from '../../../../lib/routers'
    import { AccountActionsView, CustomizeAccountView } from './views'

    export let onClose: () => unknown
</script>

{#if $accountActionsRoute === AccountActionsRoute.Actions}
    <AccountActionsView onToggleVisibilitySuccess={onClose} onDeleteSuccess={onClose} />
{:else if $accountActionsRoute === AccountActionsRoute.Customize}
    <CustomizeAccountView onSaveSucess={onClose} />
{/if}
