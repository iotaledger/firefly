<script lang="typescript">
    import { Checkbox, Dropdown, HR, Text } from 'shared/components'
    import { loggedIn, mobile } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { exchangeRates } from 'shared/lib/currency'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { settingsChildRoute } from 'shared/lib/router'
    import { Locale } from 'shared/lib/typings/i18n'
    import { GeneralSettings } from 'shared/lib/typings/routes'
    import { refreshBalanceOverview, updateAccountsBalanceEquiv } from 'shared/lib/wallet'
    import { Language, Theme } from './'

    export let locale: Locale

    let darkModeEnabled = $appSettings.darkMode
    let notificationsChecked = $appSettings.notifications
    let hideNetworkStatistics = $activeProfile?.settings.hideNetworkStatistics

    $: $appSettings.darkMode = darkModeEnabled
    $: $appSettings.notifications = notificationsChecked
    $: updateProfile('settings.hideNetworkStatistics', hideNetworkStatistics)

    const handleCurrencySelect = (item) => {
        updateProfile('settings.currency', item.value)
        void addProfileCurrencyPriceData()
        refreshBalanceOverview()
        updateAccountsBalanceEquiv()
    }
</script>

<div>
    <!-- TODO: Implement and enable
    <section id="profile" class="w-full md:w-3/4 {$mobile && $settingsChildRoute !== GeneralSettings.Profile && 'hidden'}">
        <Text type="h4" classes="mb-3">{locale('views.settings.profile.title')}</Text>
        <Text type="p" secondary>{locale('views.settings.profile.description')}</Text>
    </section>
    <HR classes="pb-5 mt-5 justify-center" /> -->
    {#if !$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Theme)}
        <Theme {locale} />
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if !$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Language)}
        <Language />
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if $loggedIn && (!$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Currency))}
        <section id="currency" class="w-full md:w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.currency.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.currency.description')}</Text>
            <Dropdown
                sortItems={true}
                onSelect={handleCurrencySelect}
                value={$activeProfile?.settings.currency}
                items={Object.keys($exchangeRates)
                    .map((currency) => ({ value: currency, label: currency }))
                    .sort()} />
        </section>
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if !$mobile || ($mobile && $settingsChildRoute === GeneralSettings.Notifications)}
        <section id="notifications" class="w-full md:w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.notifications.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.notifications.description')}</Text>
            <Checkbox label={locale('actions.enableSystemNotifications')} bind:checked={notificationsChecked} />
        </section>
        <HR classes="pb-5 mt-5 justify-center hidden md:block" />
    {/if}
    {#if $loggedIn && (!$mobile || ($mobile && $settingsChildRoute === GeneralSettings.NetworkStatus))}
        <section id="networkStatus" class="w-full md:w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.networkStatus.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.networkStatus.description')}</Text>
            <Checkbox label={locale('actions.hideNetworkStatistics')} bind:checked={hideNetworkStatistics} />
        </section>
    {/if}
</div>
