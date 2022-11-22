<script lang="typescript">
    import { Drawer } from '../../../../components'
    import { ActivityRoute, activityRoute } from '../../../../lib/routers'
    import ActivityRouter from './ActivityRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string

    $: $activityRoute, setTitle()

    function setTitle(): void {
        switch ($activityRoute) {
            case ActivityRoute.Password:
                title = 'Password required'
                break
            case ActivityRoute.Reject:
                title = 'Reject transaction'
                break
            default:
                title = 'Transaction details'
                break
        }
    }
</script>

<Drawer {onClose} {title}>
    <ActivityRouter {onClose} />
</Drawer>
