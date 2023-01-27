<script lang="typescript">
    import { AccountActionsRoute, accountActionsRoute } from '../../../../lib/routers'
    import { AccountActionsView } from './views'

    export let onClose: () => unknown
</script>

{#if $accountActionsRoute === AccountActionsRoute.Actions}
    <AccountActionsView {onClose} />
{/if}
