<script lang="typescript">
    import { Button, Dropdown, Illustration, OnboardingLayout, Radio, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { locales, setLanguage } from 'shared/lib/i18n'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    let darkModeEnabled = $appSettings.darkMode

    $: $appSettings.darkMode = darkModeEnabled

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.language.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.language.body')}</Text>
            <Dropdown
                sortItems={true}
                onSelect={(item) => setLanguage(item)}
                value={locales[$appSettings.language]}
                items={Object.values(locales).map((locale) => ({ value: locale, label: locale }))}
                classes="mb-4" />
            <div>
                <Text type="p" classes="mb-2 mt-4" smaller>{locale('general.appearance')}</Text>
                <Radio value={false} bind:group={darkModeEnabled} label={locale('general.lightTheme')} />
                <Radio value={true} bind:group={darkModeEnabled} label={locale('general.darkTheme')} />
            </div>
        </div>
        <div slot="leftpane__action">
            <Button onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="welcome-1-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
