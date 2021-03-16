<script lang="typescript">
    import { Checkbox, Dropdown, HR, Radio, Text } from 'shared/components'
    import { darkMode } from 'shared/lib/app'
    import { exchangeRates } from 'shared/lib/currency'
    import { locales, setupI18n } from 'shared/lib/i18n'
    import { addProfileCurrencyPriceData } from 'shared/lib/marketData'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { updateAccountsBalanceEquiv, updateBalanceOverviewFiat } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale

    let darkModeEnabled = $darkMode
    let notificationsChecked = get(activeProfile)?.settings.notifications ?? true

    $: darkMode.set(darkModeEnabled)
    $: updateProfile('settings.notifications', notificationsChecked)

    const setLanguage = (item) => {
        const locale = Object.keys(locales).find((key) => locales[key] === item.value)
        updateProfile('settings.language', locale)
        setupI18n({ withLocale: locale })
    }

    const handleCurrencySelect = (item) => {
        updateProfile('settings.currency', item.value)
        addProfileCurrencyPriceData()
        updateBalanceOverviewFiat()
        updateAccountsBalanceEquiv()
    }
</script>

<div>
    <section id="profile" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.profile.title')}</Text>
        <Text type="p" secondary>{locale('views.settings.profile.description')}</Text>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <!-- TODO: Implement and enable -->
    <section id="theme" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.theme.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.theme.description')}</Text>
        <Radio value={false} bind:group={darkModeEnabled} label={locale('general.lightTheme')} />
        <Radio value={true} bind:group={darkModeEnabled} label={locale('general.darkTheme')} />
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="language" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.language.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.language.description')}</Text>
        <Dropdown
            sortItems={true}
            onSelect={(item) => setLanguage(item)}
            value={locales[$activeProfile?.settings.language]}
            items={Object.values(locales).map((locale) => ({ value: locale, label: locale }))} />
    </section>
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
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="notifications" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.notifications.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.notifications.description')}</Text>
        <Checkbox label={locale('actions.enableSystemNotifications')} bind:checked={notificationsChecked} />
    </section>
</div>
