<script lang="typescript">
    import { Checkbox, Dropdown, HR, Radio, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { exchangeRates } from 'shared/lib/currency'
    import { locales, setLanguage, _ } from 'shared/lib/i18n'
    import { addProfileCurrencyPriceData } from 'shared/lib/market'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { refreshBalanceOverview, updateAccountsBalanceEquiv } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'

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

    const handleLanguage = (item) => {
        setLanguage(item)
        locale = $_
        refreshBalanceOverview()
        updateAccountsBalanceEquiv()
    }
</script>

<div>
    <!-- TODO: Implement and enable
    <section id="profile" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.profile.title')}</Text>
        <Text type="p" secondary>{locale('views.settings.profile.description')}</Text>
    </section>
    <HR classes="pb-5 mt-5 justify-center" /> -->
    <section id="theme" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.theme.title')}</Text>
        <Radio value={false} bind:group={darkModeEnabled} label={locale('general.lightTheme')} />
        <Radio value={true} bind:group={darkModeEnabled} label={locale('general.darkTheme')} />
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="language" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.language.title')}</Text>
        <Dropdown
            sortItems={true}
            onSelect={handleLanguage}
            value={locales[$appSettings.language]}
            items={Object.values(locales).map((locale) => ({ value: locale, label: locale }))} />
    </section>
    {#if $loggedIn}
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="currency" class="w-3/4">
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
    {/if}
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="notifications" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.notifications.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.notifications.description')}</Text>
        <Checkbox label={locale('actions.enableSystemNotifications')} bind:checked={notificationsChecked} />
    </section>
    {#if $loggedIn}
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="networkStatus" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.networkStatus.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.networkStatus.description')}</Text>
            <Checkbox label={locale('actions.hideNetworkStatistics')} bind:checked={hideNetworkStatistics} />
        </section>
    {/if}
</div>
