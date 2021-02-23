<script>
    import { get } from 'svelte/store'
    import { darkMode } from 'shared/lib/app'
    import { Text, Radio, Dropdown, Checkbox } from 'shared/components'
    import { exchangeRates } from 'shared/lib/currency'
    import { locales, setupI18n } from 'shared/lib/i18n'
    import { activeProfile, updateProfile } from 'shared/lib/profile'

    export let locale

    let darkModeEnabled = $darkMode
    let notificationsChecked = get(activeProfile).settings.notifications

    $: darkMode.set(darkModeEnabled)
    $: updateProfile('settings.notifications', notificationsChecked)

    const setLanguage = (item) => {
        const locale = Object.keys(locales).find((key) => locales[key] === item.value)
        updateProfile('settings.language', locale)
        setupI18n({ withLocale: locale })
    }
</script>

<div>
    <section id="profile" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.profile.title')}</Text>
        <Text type="p" secondary>{locale('views.settings.profile.description')}</Text>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="theme" class="w-3/4">
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
            onSelect={(item) => setLanguage(item)}
            value={locales[$activeProfile.settings.language]}
            items={Object.values(locales).map((locale) => ({ value: locale, label: locale }))} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="currency" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.currency.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.currency.description')}</Text>
        <Dropdown
            sortItems={true}
            onSelect={(item) => updateProfile('settings.currency', item.value)}
            value={$activeProfile.settings.currency}
            items={Object.keys($exchangeRates)
                .map((currency) => ({ value: currency, label: currency }))
                .sort()} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="notifications" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.notifications.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.notifications.description')}</Text>
        <Checkbox label={locale('actions.enableSystemNotifications')} bind:checked={notificationsChecked} />
    </section>
</div>
