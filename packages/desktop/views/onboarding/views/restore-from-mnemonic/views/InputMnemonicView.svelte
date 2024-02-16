<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { Animation, Button, HTMLButtonType, ImportTextfield, Text } from '@ui'
    import { onMount } from 'svelte'
    import { restoreFromMnemonicRouter } from '@core/router'
    import { AnimationEnum } from '@auxiliary/animation'

    let input = ''

    function onContinueClick(): void {
        const mnemonic = input.split(' ')
        updateOnboardingProfile({ mnemonic })
        $restoreFromMnemonicRouter.next()
    }

    function onBackClick(): void {
        $restoreFromMnemonicRouter.previous()
    }

    onMount(() => {
        // Clean up if user has navigated back to this view
        updateOnboardingProfile({ mnemonic: undefined, hasStoredMnemonic: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileRecovery.importMnemonicPhrase.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8"
            >{localize('views.onboarding.profileRecovery.importMnemonicPhrase.body')}</Text
        >
        <Text type="h5" classes="mb-3">{localize('views.onboarding.profileRecovery.importMnemonicPhrase.enter')}</Text>
        <form on:submit|preventDefault={onContinueClick} id="text-import-form">
            <ImportTextfield type={$onboardingProfile?.restoreProfileType} bind:value={input} />
        </form>
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button type={HTMLButtonType.Submit} form="text-import-form" classes="flex-1" disabled={input.length === 0}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation animation={AnimationEnum.ImportFromTextDesktop} />
    </div>
</OnboardingLayout>
