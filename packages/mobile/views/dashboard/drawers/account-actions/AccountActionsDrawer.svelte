<script lang="typescript">
    import { Drawer } from '../../../../components'
    import { AccountActionsRoute, accountActionsRoute } from '../../../../lib/routers'
    import AccountActionsRouter from './AccountActionsRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string

    $: $accountActionsRoute, setTitle()

    function setTitle(): void {
        switch ($accountActionsRoute) {
            case AccountActionsRoute.Actions:
                title = null
                break
        }
    }
</script>

<Drawer {onClose} {title}>
    <AccountActionsRouter {onClose} />
</Drawer>
