<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { Button, ImportTextfield, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { profileRecoveryRouter } from '../../../../../lib/routers'
    import {
        DEFAULT_STRONGHOLD_PASSWORD,
        onboardingProfile,
        updateOnboardingProfile,
        verifyAndStoreMnemonic,
    } from '@contexts/onboarding'

    const title = localize('views.onboarding.profileRecovery.importMnemonicPhrase.title')

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

<OnboardingLayout {onBackClick} {title}>
    <div slot="content">
        <Text type={TextType.p} secondary classes="mb-8"
            >{localize('views.onboarding.profileRecovery.importMnemonicPhrase.body')}</Text
        >
        <Text type={TextType.h5} classes="mb-3"
            >{localize('views.onboarding.profileRecovery.importMnemonicPhrase.enter')}</Text
        >
        <ImportTextfield type={$onboardingProfile?.recoveryType} bind:value={input} />
    </div>
    <div slot="footer" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" onClick={onContinueClick} disabled={input.length === 0}>
            {localize('actions.continue')}
        </Button>
    </div>
</OnboardingLayout>
