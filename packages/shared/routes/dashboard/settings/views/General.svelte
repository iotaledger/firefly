<script>
    import { darkMode } from 'shared/lib/app'
    import { Text, Radio, Dropdown, Toggle } from 'shared/components'
    import { exchangeRates } from 'shared/lib/currency'

    import { currency } from 'shared/lib/settings'

    export let locale

    let darkModeEnabled = $darkMode
    let notificationsEnabled = true

    $: darkMode.set(darkModeEnabled)
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
        <Dropdown value="English" items={[{ value: 1, label: 'English' }, { value: 2, label: 'Belula' }]} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="currency" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.currency.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.currency.description')}</Text>
        <Dropdown 
            sortItems={true}
            onSelect={(item) => currency.set(item.value)}
            value={$currency} 
            items={Object.keys($exchangeRates).map((currency) => ({ value: currency, label: currency })).sort()} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="notifications" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.notifications.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.exportStronghold.description')}</Text>
        <Toggle value={notificationsEnabled} label={locale('actions.enableNotifications')} />
    </section>
</div>
