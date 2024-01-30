<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { CreateProfileType, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import {
        ProfileType,
        clearProfileFromMemory,
        getSecretManagerFromProfileType,
        getStorageDirectoryOfSecretManager,
        removeProfileFolder,
    } from '@core/profile'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text } from '@ui'
    import { onMount } from 'svelte'
    import { createProfileRouter } from '../create-profile-router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { AnimationEnum } from '@auxiliary/animation'

    let isBusy = {
        [CreateProfileType.Mnemonic]: false,
        [CreateProfileType.Ledger]: false,
    }

    $: isDisabled = Object.values(isBusy).some((busy) => busy)

    const networkId = $onboardingProfile?.network?.id

    async function onProfileTypeClick(createProfileType: CreateProfileType): Promise<void> {
        isBusy = { ...isBusy, [createProfileType]: true }
        const type = createProfileType === CreateProfileType.Ledger ? ProfileType.Ledger : ProfileType.Software
        const secretManagerPath = await getStorageDirectoryOfSecretManager($onboardingProfile.id)
        const secretManagerOptions = getSecretManagerFromProfileType(type, secretManagerPath)
        updateOnboardingProfile({ createProfileType, type, secretManagerOptions })
        $createProfileRouter.next()
    }

    function onBackClick(): void {
        $createProfileRouter.previous()
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view
        if ($onboardingProfile.secretManagerOptions) {
            await clearProfileFromMemory()
            await removeProfileFolder($onboardingProfile.id)
        }
        updateOnboardingProfile({ type: undefined, createProfileType: undefined, secretManagerOptions: undefined })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileSetup.setupNew.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupNew.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.softwareAccount.title')}
            secondaryText={localize('views.onboarding.profileSetup.setupNew.softwareAccount.description')}
            icon={IconEnum.File}
            busy={isBusy[CreateProfileType.Mnemonic]}
            hidden={features?.onboarding?.[networkId]?.newProfile?.softwareProfile?.hidden}
            disabled={!features?.onboarding?.[networkId]?.newProfile?.softwareProfile?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(CreateProfileType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.ledgerAccount.title')}
            secondaryText={localize('views.onboarding.profileSetup.setupNew.ledgerAccount.description')}
            icon={IconEnum.Chip}
            busy={isBusy[CreateProfileType.Ledger]}
            hidden={features?.onboarding?.[networkId]?.newProfile?.ledgerProfile?.hidden}
            disabled={!features?.onboarding?.[networkId]?.newProfile?.ledgerProfile?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(CreateProfileType.Ledger)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-purple dark:bg-gray-900">
        <Animation animation={AnimationEnum.ImportDesktop} />
    </div>
</OnboardingLayout>
