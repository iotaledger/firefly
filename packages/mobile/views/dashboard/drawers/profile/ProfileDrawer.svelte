<script lang="typescript">
    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'
    import { Drawer } from '../../../../components'
    import { SETTINGS_ROUTE_META } from '../../../../lib/contexts/settings'
    import {
        networkConfigurationSettingsRoute,
        NetworkConfigurationSettingsRoute,
        networkConfigurationSettingsRouter,
        NetworkConfigurationSettingsRouter,
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
    let activeRouter: ProfileRouter | SettingsRouter | NetworkConfigurationSettingsRouter = $profileRouter

    $: $profileRoute,
        $settingsRoute,
        $networkConfigurationSettingsRoute,
        (setTitle(), setAllowBack(), setActiveRouter())
    $: $appSettings.language, setTitle()

    function setActiveRouter(): void {
        if ($profileRoute === ProfileRoute.Settings) {
            if ($settingsRoute === SettingsRoute.NetworkConfiguration) {
                activeRouter = $networkConfigurationSettingsRouter
            } else {
                activeRouter = $settingsRouter
            }
        } else {
            activeRouter = $profileRouter
        }
    }
    function setTitle(): void {
        if ($profileRoute === ProfileRoute.Settings) {
            if ($settingsRoute === SettingsRoute.Init) {
                title = localize('views.settings.settings')
            } else if (
                $settingsRoute === SettingsRoute.NetworkConfiguration &&
                $networkConfigurationSettingsRoute !== NetworkConfigurationSettingsRoute.Init
            ) {
                switch ($networkConfigurationSettingsRoute) {
                    case NetworkConfigurationSettingsRoute.NodeDetails:
                        title = localize('popups.node.titleDetails')
                        break
                    case NetworkConfigurationSettingsRoute.AddNode:
                        title = localize('popups.node.titleAdd')
                        break
                    case NetworkConfigurationSettingsRoute.EditNode:
                        title = localize('popups.node.titleUpdate')
                        break
                    case NetworkConfigurationSettingsRoute.DeleteNodeConfirmation:
                        title = localize('popups.node.titleRemove')
                        break
                    case NetworkConfigurationSettingsRoute.ExcludeNodeConfirmation:
                        title = localize('popups.excludeNode.title')
                        break
                }
            } else {
                title = localize(SETTINGS_ROUTE_META[$settingsRoute].name)
            }
        } else {
            if ($profileRoute === ProfileRoute.NetworkStatus) {
                title = localize('views.settings.networkStatus.title')
            } else {
                title = localize('views.settings.profile.title')
            }
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
