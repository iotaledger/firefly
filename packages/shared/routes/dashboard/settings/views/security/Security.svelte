<script lang="typescript">
    import { exportStronghold } from '@contexts/settings'
    import { isSoftwareProfile } from '@core/profile'
    import { SecuritySettings } from '@core/router'
    import { HR } from 'shared/components'
    import { AppLock, ChangePassword, ChangePincode, DeleteProfile, ExportStronghold } from './'
    import featureFlags from 'shared/featureFlags.config'

    const settings: {
        component: unknown
        childRoute: SecuritySettings
        requireSoftware?: boolean
    }[] = [
        { component: ExportStronghold, childRoute: SecuritySettings.ExportStronghold, requireSoftware: true },
        { component: AppLock, childRoute: SecuritySettings.AppLock },
        { component: ChangePassword, childRoute: SecuritySettings.ChangePassword, requireSoftware: true },
        { component: ChangePincode, childRoute: SecuritySettings.ChangePincode },
        { component: DeleteProfile, childRoute: SecuritySettings.DeleteProfile },
    ]
    const visibleSettings = settings.filter((setting) => featureFlags?.settings.security?.[setting.childRoute]?.enabled)

    const props = {
        [SecuritySettings.ChangePassword]: { exportStronghold },
    }
</script>

<div>
    {#each visibleSettings as { component, childRoute, requireSoftware }, index}
        {#if !requireSoftware || (requireSoftware && $isSoftwareProfile)}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} {...props[childRoute]} />
            </section>
            {#if index < settings.length - 1}
                <HR classes="pb-5 mt-5 justify-center" />
            {/if}
        {/if}
    {/each}
</div>
