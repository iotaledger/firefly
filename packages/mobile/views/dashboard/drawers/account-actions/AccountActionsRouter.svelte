<script lang="typescript">
    import { AccountActionsRoute, accountActionsRoute } from '../../../../lib/routers'
    import { AccountActionsView, CustomizeAccountView } from './views'

    export let onClose: () => unknown
</script>

{#if $accountActionsRoute === AccountActionsRoute.Actions}
    <AccountActionsView />
{:else if $accountActionsRoute === AccountActionsRoute.Customize}
    <CustomizeAccountView onSaveSucess={onClose} />
{/if}
