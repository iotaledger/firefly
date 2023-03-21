<script lang="ts">
    import { HR } from 'shared/components'
    import { GeneralSettingsRoute } from '@core/router'
    import { CrashReporting, DeepLinks, Language, Notifications, Theme } from './'
    import { activeProfile } from '@core/profile'
    import features from '@features/features'

    const settings: {
        component: unknown
        childRoute: GeneralSettingsRoute
        requireLogin?: boolean
    }[] = [
        { component: Theme, childRoute: GeneralSettingsRoute.Theme },
        { component: Language, childRoute: GeneralSettingsRoute.Language },
        { component: Notifications, childRoute: GeneralSettingsRoute.Notifications },
        { component: DeepLinks, childRoute: GeneralSettingsRoute.DeepLinks },
        { component: CrashReporting, childRoute: GeneralSettingsRoute.CrashReporting },
    ]
    const visibleSettings = settings.filter((setting) => features?.settings?.general?.[setting.childRoute]?.enabled)

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
