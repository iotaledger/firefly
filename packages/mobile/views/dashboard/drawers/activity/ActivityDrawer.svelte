<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Activity } from '@core/wallet'
    import { Drawer } from '../../../../components'
    import { ActivityRoute, activityRoute } from '../../../../lib/routers'
    import ActivityRouter from './ActivityRouter.svelte'

    export let onClose: () => unknown = () => {}
    export let activity: Activity

    let title: string
    let fullScreen: boolean = true

    $: $activityRoute, configureDrawer()

    function configureDrawer(): void {
        switch ($activityRoute) {
            case ActivityRoute.Password:
                title = localize('popups.password.title')
                fullScreen = false
                break
            case ActivityRoute.Reject:
                title = localize('actions.confirmRejection.title')
                fullScreen = false
                break
            default:
                title = localize('popups.transactionDetails.title')
                fullScreen = true
                break
        }
    }
</script>

<Drawer {onClose} {title} {fullScreen}>
    <ActivityRouter {activity} />
</Drawer>
