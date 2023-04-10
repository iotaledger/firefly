<script lang="ts">
    import ProfileRouterComponent from './ProfileRouter.svelte'

    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'

    import { DrawerId, updateDrawerProps } from '@/auxiliary/drawer'
    import { SETTINGS_ROUTE_META } from '@/contexts/settings'
    import {
        networkInformationSettingsRoute,
        NetworkInformationSettingsRoute,
        ProfileRoute,
        profileRoute,
        SettingsRoute,
        settingsRoute,
    } from '@/routers'

    let title: string

    $: $profileRoute, $settingsRoute, $networkInformationSettingsRoute, updateTitle()
    $: $appSettings.language, updateTitle()
    $: title, updateDrawerProps(DrawerId.Profile, { title })

    function updateTitle(): void {
        if ($profileRoute === ProfileRoute.Settings) {
            if ($settingsRoute === SettingsRoute.Init) {
                title = localize('views.settings.settings')
            } else if (
                $settingsRoute === SettingsRoute.NetworkInformation &&
                $networkInformationSettingsRoute !== NetworkInformationSettingsRoute.Init
            ) {
                switch ($networkInformationSettingsRoute) {
                    case NetworkInformationSettingsRoute.NodeDetails:
                        title = localize('popups.node.titleDetails')
                        break
                    case NetworkInformationSettingsRoute.AddNode:
                        title = localize('popups.node.titleAdd')
                        break
                    case NetworkInformationSettingsRoute.EditNode:
                        title = localize('popups.node.titleUpdate')
                        break
                    case NetworkInformationSettingsRoute.DeleteNodeConfirmation:
                        title = localize('popups.node.titleRemove')
                        break
                    case NetworkInformationSettingsRoute.ExcludeNodeConfirmation:
                        title = localize('popups.excludeNode.title')
                        break
                    case NetworkInformationSettingsRoute.UnsetAsPrimaryNodeConfirmation:
                        title = localize('popups.unsetAsPrimaryNode.title')
                        break
                }
            } else {
                title = localize(SETTINGS_ROUTE_META[$settingsRoute].name)
            }
        } else {
            title = localize('views.settings.profile.title')
        }
    }
</script>

<ProfileRouterComponent />
