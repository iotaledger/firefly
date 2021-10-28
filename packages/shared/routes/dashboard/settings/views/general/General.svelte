<script lang="typescript">
    import { HR } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { settingsChildRoute } from 'shared/lib/router'
    import { GeneralSettings } from 'shared/lib/typings/routes'
    import { Currency, Language, NetworkStatus, Notifications, Theme } from './'

    const settings = [
        { component: Theme, childRoute: GeneralSettings.Theme },
        { component: Language, childRoute: GeneralSettings.Language },
        { component: Currency, childRoute: GeneralSettings.Currency, requireLogin: true },
        { component: Notifications, childRoute: GeneralSettings.Notifications },
        { component: NetworkStatus, childRoute: GeneralSettings.NetworkStatus, requireLogin: true },
    ]
</script>

<div>
    {#each settings as { component, childRoute, requireLogin }, index}
        {#if (!requireLogin || (requireLogin && $loggedIn)) && (!$mobile || ($mobile && $settingsChildRoute === childRoute))}
            <svelte:component this={component} />
            {#if index < settings.length - 1}
                <HR classes="pb-5 mt-5 justify-center hidden md:block" />
            {/if}
        {/if}
    {/each}
</div>
