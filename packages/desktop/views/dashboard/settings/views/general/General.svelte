<script lang="typescript">
    import { HR } from 'shared/components'
    import { GeneralSettingsRoute } from '@core/router'
    import { Currency, Language, NetworkStatus, Notifications, Theme } from './'
    import ChangeProfileName from './ChangeProfileName.svelte'
    import { activeProfile } from '@core/profile'
    import features from 'shared/features/features'

    const settings: {
        component: unknown
        childRoute: GeneralSettingsRoute
        requireLogin?: boolean
    }[] = [
        { component: Theme, childRoute: GeneralSettingsRoute.Theme },
        { component: Language, childRoute: GeneralSettingsRoute.Language },
        { component: Currency, childRoute: GeneralSettingsRoute.Currency, requireLogin: true },
        { component: Notifications, childRoute: GeneralSettingsRoute.Notifications },
        { component: NetworkStatus, childRoute: GeneralSettingsRoute.NetworkStatus, requireLogin: true },
        { component: ChangeProfileName, childRoute: GeneralSettingsRoute.ChangeProfileName, requireLogin: true },
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
