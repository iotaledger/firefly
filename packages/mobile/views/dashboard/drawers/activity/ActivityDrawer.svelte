<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Drawer } from '../../../../components'
    import { ActivityRoute, activityRoute } from '../../../../lib/routers'
    import ActivityRouter from './ActivityRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string

    $: $activityRoute, setTitle()

    function setTitle(): void {
        switch ($activityRoute) {
            case ActivityRoute.Password:
                title = localize('popups.password.title')
                break
            case ActivityRoute.Reject:
                title = localize('actions.confirmRejection.title')
                break
            default:
                title = localize('popups.transactionDetails.title')
                break
        }
    }
</script>

<Drawer {onClose} {title}>
    <ActivityRouter {onClose} />
</Drawer>
