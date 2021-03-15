<script lang="typescript">
    import { Checkbox, Dropdown, Radio, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { exchangeRates } from 'shared/lib/currency'
    import { locales, setLanguage, _ } from 'shared/lib/i18n'
    import { addProfileCurrencyPriceData } from 'shared/lib/marketData'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { updateAccountsBalanceEquiv, updateBalanceOverviewFiat } from 'shared/lib/wallet'

    export let locale

    let darkModeEnabled = $appSettings.darkMode
    let notificationsChecked = $appSettings.notifications

    $: $appSettings.darkMode = darkModeEnabled
    $: $appSettings.notifications = notificationsChecked

    const handleCurrencySelect = (item) => {
        updateProfile('settings.currency', item.value)
        addProfileCurrencyPriceData()
        updateBalanceOverviewFiat()
        updateAccountsBalanceEquiv()
    }

    const handleLanguage = (item) => {
        setLanguage(item)
        locale = $_
    }
</script>

<div>
    <section id="profile" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.profile.title')}</Text>
        <Text type="p" secondary>{locale('views.settings.profile.description')}</Text>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <!-- TODO: Implement and enable -->
    <section id="theme" class="w-3/4 opacity-50 pointer-events-none">
        <Text type="h4" classes="mb-3">{locale('views.settings.theme.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.theme.description')}</Text>
        <Radio value={false} bind:group={darkModeEnabled} label={locale('general.light_theme')} />
        <Radio value={true} bind:group={darkModeEnabled} label={locale('general.dark_theme')} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="language" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.language.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.language.description')}</Text>
        <Dropdown
            sortItems={true}
            onSelect={handleLanguage}
            value={locales[$appSettings.language]}
            items={Object.values(locales).map((locale) => ({ value: locale, label: locale }))} />
    </section>
    {#if $loggedIn}
        <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
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
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="notifications" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.notifications.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.notifications.description')}</Text>
        <Checkbox label={locale('actions.enableSystemNotifications')} bind:checked={notificationsChecked} />
    </section>
</div>
