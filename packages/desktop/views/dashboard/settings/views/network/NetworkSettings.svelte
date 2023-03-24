<script lang="ts">
    import { activeProfile } from '@core/profile'
    import { NetworkSettingsRoute } from '@core/router'
    import features from '@features/features'
    import { HR } from '@ui'
    import { NetworkConfiguration } from './'

    const settings: {
        component: unknown
        childRoute: NetworkSettingsRoute
        requireLogin?: boolean
    }[] = [{ component: NetworkConfiguration, childRoute: NetworkSettingsRoute.NetworkConfiguration }]
    const visibleSettings = settings.filter((setting) => features?.settings?.network?.[setting.childRoute]?.enabled)

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
