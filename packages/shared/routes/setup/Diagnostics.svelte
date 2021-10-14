<script lang="typescript">
    import { Animation, Button, Checkbox, OnboardingLayout, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Locale } from 'shared/lib/typings/i18n'
    import { appSettings } from 'shared/lib/appSettings'

    export let locale: Locale
    export let mobile

    let busy = false
    let sendDiagnostics = $appSettings.sendDiagnostics

    const dispatch = createEventDispatcher()

    const handleBackClick = () => {
        dispatch('previous')
    }

    const handleContinueClick = () => {
        appSettings.set({ ...get(appSettings), sendDiagnostics })

        dispatch('next')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.diagnostics.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.diagnostics.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Checkbox label={locale('views.diagnostics.checkbox')} bind:checked={sendDiagnostics} classes="mb-8" />
            <Button classes="w-full" onClick={handleContinueClick}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-orange dark:bg-gray-900">
            <Animation animation="secure-desktop"/>
        </div>
    </OnboardingLayout>
{/if}
