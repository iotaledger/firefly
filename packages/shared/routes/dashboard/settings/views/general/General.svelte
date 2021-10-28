<script lang="typescript">
    import { HR } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { settingsChildRoute } from 'shared/lib/router'
    import { GeneralSettings } from 'shared/lib/typings/routes'
    import { Currency, Language, NetworkStatus, Notifications, Theme } from './'

    let notificationsChecked = $appSettings.notifications
    let hideNetworkStatistics = $activeProfile?.settings.hideNetworkStatistics

    $: $appSettings.notifications = notificationsChecked
    $: updateProfile('settings.hideNetworkStatistics', hideNetworkStatistics)
</script>

<div>
    {#if !$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Theme)}
        <Theme />
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if !$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Language)}
        <Language />
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if $loggedIn && (!$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Currency))}
        <Currency />
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if !$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Notifications)}
        <Notifications />
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if $loggedIn && (!$mobile || ($mobile && $settingsChildRoute === GeneralSettings.NetworkStatus))}
        <NetworkStatus />
    {/if}
</div>
