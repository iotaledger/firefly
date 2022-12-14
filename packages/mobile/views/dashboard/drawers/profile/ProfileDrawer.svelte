<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Drawer } from '../../../../components'
    import { SETTINGS_ROUTE_META } from '../../../../lib/contexts/dashboard'
    import {
        ProfileRoute,
        profileRoute,
        ProfileRouter,
        profileRouter,
        SettingsRoute,
        settingsRoute,
        SettingsRouter,
        settingsRouter,
    } from '../../../../lib/routers'
    import ProfileRouterComponent from './ProfileRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string
    let allowBack: boolean
    let activeRouter: ProfileRouter | SettingsRouter = $profileRouter

    $: $profileRoute, (setTitle(), setAllowBack(), setActiveRouter())

    function setActiveRouter(): void {
        if ($profileRoute === ProfileRoute.Settings) {
            activeRouter = $settingsRouter
        } else {
            activeRouter = $profileRouter
        }
    }
    function setTitle(): void {
        if (activeRouter === $settingsRouter) {
            if ($settingsRoute === SettingsRoute.Init) {
                title = localize('views.settings.settings')
            } else {
                title = localize(SETTINGS_ROUTE_META[$settingsRoute].name)
            }
        } else {
            title = localize('views.settings.profile.title')
        }
    }
    function setAllowBack(): void {
        switch ($profileRoute) {
            default:
                allowBack = true
                break
        }
    }
</script>

<Drawer {onClose} {title} fullScreen enterFromSide {allowBack} onBackClick={() => activeRouter.previous()}>
    <ProfileRouterComponent />
</Drawer>
