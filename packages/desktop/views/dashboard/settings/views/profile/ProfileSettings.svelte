<script lang="ts">
    import { activeProfile } from '@core/profile'
    import { ProfileSettingsRoute } from '@core/router'
    import features from '@features/features'
    import { HR } from 'shared/components'
    import { ChangeProfileName, Currency, DeleteProfile } from './'

    const settings: {
        component: unknown
        childRoute: ProfileSettingsRoute
        requireLogin?: boolean
    }[] = [
        { component: ChangeProfileName, childRoute: ProfileSettingsRoute.ChangeProfileName },
        { component: Currency, childRoute: ProfileSettingsRoute.Currency },
        { component: DeleteProfile, childRoute: ProfileSettingsRoute.DeleteProfile },
    ]
    const visibleSettings = settings.filter((setting) => features?.settings?.profile?.[setting.childRoute]?.enabled)

    const { loggedIn } = $activeProfile
</script>

<div>
    {#each visibleSettings as { component, childRoute, requireLogin }, index}
        {#if !requireLogin || (requireLogin && $loggedIn)}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} />
            </section>
            {#if index < visibleSettings.length - 1}
                <HR classes="pb-5 mt-5 justify-center" />
            {/if}
        {/if}
    {/each}
</div>
