<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Drawer } from '../../../../components'
    import { profileRoute, profileRouter } from '../../../../lib/routers'
    import ProfileRouter from './ProfileRouter.svelte'

    export let onClose: () => unknown = () => {}

    let title: string
    let allowBack: boolean

    $: $profileRoute, (setTitle(), setAllowBack())

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

<Drawer {onClose} {title} fullScreen enterFromSide {allowBack} onBackClick={() => $profileRouter.previous()}>
    <ProfileRouter />
</Drawer>
