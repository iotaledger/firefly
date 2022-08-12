<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, ImportTextfield, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '@core/router'
    import {
        DEFAULT_STRONGHOLD_PASSWORD,
        onboardingProfile,
        updateOnboardingProfile,
        verifyAndStoreMnemonic,
    } from '@contexts/onboarding'
    import { setStrongholdPassword } from '@core/profile-manager'

    let input = ''

    async function onContinueClick(): Promise<void> {
        const mnemonic = input.split(' ')
        updateOnboardingProfile({ mnemonic })
        await setStrongholdPassword(DEFAULT_STRONGHOLD_PASSWORD)
        updateOnboardingProfile({ strongholdPassword: DEFAULT_STRONGHOLD_PASSWORD })
        await verifyAndStoreMnemonic()
        $profileRecoveryRouter.next()
    }

    function onBackClick(): void {
        $profileRecoveryRouter.previous()
    }

    onMount(() => {
        updateOnboardingProfile({ hasStoredMnemonic: false, mnemonic: null })
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
        <form on:submit={onContinueClick} id="text-import-form">
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
