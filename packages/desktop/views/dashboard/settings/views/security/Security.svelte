<script lang="ts">
    import { isSoftwareProfile } from '@core/profile'
    import { SecuritySettingsRoute } from '@core/router'
    import features from '@features/features'
    import { HR } from 'shared/components'
    import { AppLock, ChangePassword, ChangePincode, ExportStronghold, StrongholdPasswordTimeout } from './'

    const settings: {
        component: unknown
        childRoute: SecuritySettingsRoute
        requireSoftware?: boolean
    }[] = [
        { component: AppLock, childRoute: SecuritySettingsRoute.AppLock },
        {
            component: StrongholdPasswordTimeout,
            childRoute: SecuritySettingsRoute.StrongholdPasswordTimeout,
            requireSoftware: true,
        },
        { component: ChangePincode, childRoute: SecuritySettingsRoute.ChangePincode },
        { component: ChangePassword, childRoute: SecuritySettingsRoute.ChangePassword, requireSoftware: true },
        { component: ExportStronghold, childRoute: SecuritySettingsRoute.ExportStronghold, requireSoftware: true },
    ]
    const visibleSettings = settings.filter((setting) => features?.settings?.security?.[setting.childRoute]?.enabled)
</script>

<div>
    {#each visibleSettings as { component, childRoute, requireSoftware }, index}
        {#if !requireSoftware || (requireSoftware && $isSoftwareProfile)}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} />
            </section>
            {#if index < settings.length - 1}
                <HR classes="pb-5 mt-5 justify-center" />
            {/if}
        {/if}
    {/each}
</div>
