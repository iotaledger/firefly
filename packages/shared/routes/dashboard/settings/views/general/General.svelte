<script lang="typescript">
    import { HR } from 'shared/components'
    import { GeneralSettings } from '@core/router'
    import { Currency, Language, NetworkStatus, Notifications, Theme } from './'
    import ChangeProfileName from './ChangeProfileName.svelte'
    import { activeProfile } from '@core/profile'
    import featureFlags from 'shared/featureFlags.config'

    const settings: {
        component: unknown
        childRoute: GeneralSettings
        requireLogin?: boolean
    }[] = [
        { component: Theme, childRoute: GeneralSettings.Theme },
        { component: Language, childRoute: GeneralSettings.Language },
        { component: Currency, childRoute: GeneralSettings.Currency, requireLogin: true },
        { component: Notifications, childRoute: GeneralSettings.Notifications },
        { component: NetworkStatus, childRoute: GeneralSettings.NetworkStatus, requireLogin: true },
        { component: ChangeProfileName, childRoute: GeneralSettings.ChangeProfileName, requireLogin: true },
    ]
    const visibleSettings = settings.filter((setting) => featureFlags?.settings?.general?.[setting.childRoute]?.enabled)

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
