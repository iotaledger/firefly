<script lang="typescript">
    import { Button, ButtonRadio, Icon, Illustration, OnboardingLayout, Radio, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
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
            <Text type="h2" classes="mb-5">{locale('views.appearance.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.appearance.body')}</Text>
            <Text type="p" classes="mb-2 mt-4" smaller>{locale('general.appearance')}</Text>
            <ButtonRadio icon="theme-light" value={false} bind:group={darkModeEnabled}>
                {locale('general.lightTheme')}
            </ButtonRadio>
            <ButtonRadio icon="theme-dark" value={true} bind:group={darkModeEnabled}>
                {locale('general.darkTheme')}
            </ButtonRadio>
        </div>
        <div slot="leftpane__action">
            <Button onClick={() => handleContinueClick()} classes="w-full">{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16" style="background-color: #FFF8EF">
            <Illustration illustration="appearance-desktop" width="auto" height="auto" />
        </div>
    </OnboardingLayout>
{/if}
