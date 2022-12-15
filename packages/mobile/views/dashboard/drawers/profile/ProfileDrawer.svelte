<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Drawer } from '../../../../components'
    import {
        ProfileRoute,
        profileRoute,
        ProfileRouter,
        profileRouter,
        SettingsRouter,
        settingsRouter,
    } from '../../../../lib/routers'
    import ProfileRouterComponent from './ProfileRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string
    let allowBack: boolean
    let activeRouter: ProfileRouter | SettingsRouter = $profileRouter

    $: $profileRoute, (setTitle(), setAllowBack(), setActiveRouter())

    function changeTitle(newTitle: string) {
        title = newTitle
    }

    function setActiveRouter(): void {
        if ($profileRoute === ProfileRoute.Settings) {
            activeRouter = $settingsRouter
        } else {
            activeRouter = $profileRouter
        }
    }

    function setTitle(): void {
        switch ($profileRoute) {
            default:
                title = localize('views.settings.profile.title')
                break
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
    <ProfileRouterComponent {changeTitle} />
</Drawer>
