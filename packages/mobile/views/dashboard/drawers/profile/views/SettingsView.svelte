<script lang="typescript">
    import { localize } from '@core/i18n'
    import { SETTINGS } from '../../../../../lib/contexts/dashboard'
    import { SettingsRoute, settingsRoute } from '../../../../../lib/routers'
    import { SettingsRouter } from './settings'

    export let changeTitle: (title: string) => void

    $: $settingsRoute, setTitle()

    function setTitle(): void {
        if ($settingsRoute === SettingsRoute.Init) {
            changeTitle(localize('views.settings.settings'))
        } else {
            changeTitle(localize(SETTINGS[$settingsRoute].name))
        }
    }
</script>

<SettingsRouter />
