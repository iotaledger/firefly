<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, ImportTextfield, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '@core/router'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'

    let input = ''

    function handleContinueClick(): void {
        const mnemonic = input.split(' ')
        updateOnboardingProfile({ mnemonic })
        $profileRecoveryRouter.next()
    }

    function handleBackClick(): void {
        $profileRecoveryRouter.previous()
    }

    onMount(() => {
        updateOnboardingProfile({ mnemonic: null })
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize(`views.importFromText.${$onboardingProfile?.recoveryType}.title`)}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8"
            >{localize(`views.importFromText.${$onboardingProfile?.recoveryType}.body`)}</Text
        >
        <Text type="h5" classes="mb-3"
            >{localize(`views.importFromText.${$onboardingProfile?.recoveryType}.enter`)}</Text
        >
        <form on:submit={handleContinueClick} id="text-import-form">
            <ImportTextfield type={$onboardingProfile?.recoveryType} bind:value={input} />
        </form>
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button type="submit" form="text-import-form" classes="flex-1" disabled={input.length === 0}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-text-desktop" />
    </div>
</OnboardingLayout>
