<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button, Dropdown, Radio } from 'shared/components'
    import { darkMode } from 'shared/lib/app'

    export let locale
    export let mobile

    let darkModeEnabled = $darkMode

    $: darkMode.set(darkModeEnabled)

    const dispatch = createEventDispatcher()

    function handleContinueClick(setupType) {
        dispatch('next', { setupType })
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
            <Text type="h2" classes="mb-5">{locale('views.settings.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.settings.body')}</Text>
            <Dropdown
                value="English"
                label={locale('general.language')}
                items={[{ value: 1, label: 'English' }, { value: 2, label: 'Belula' }]}
                disabled
                classes="mb-4" />
            <div>
                <Text type="p" classes="mb-2" secondary smaller>{locale('general.appearance')}</Text>
                <Radio value={false} bind:group={darkModeEnabled} label={locale('general.light_theme')} />
                <Radio value={true} bind:group={darkModeEnabled} label={locale('general.dark_theme')} />
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
