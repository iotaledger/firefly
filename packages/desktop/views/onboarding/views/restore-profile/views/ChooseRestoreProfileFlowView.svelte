<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        RestoreProfileType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getNetworkNameFromNetworkId } from '@core/network'
    import { ProfileType, removeProfileFolder } from '@core/profile'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text } from '@ui'
    import { onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'
    import { destroyProfileManager } from '@core/profile-manager/actions'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { AnimationEnum } from '@auxiliary/animation'

    let isBusy = {
        [RestoreProfileType.Mnemonic]: false,
        [RestoreProfileType.Stronghold]: false,
        [RestoreProfileType.Ledger]: false,
    }

    $: isDisabled = Object.values(isBusy).some((busy) => busy)

    const networkId = $onboardingProfile?.network?.id

    async function onProfileTypeClick(restoreProfileType: RestoreProfileType): Promise<void> {
        isBusy = { ...isBusy, [restoreProfileType]: true }
        const type = restoreProfileType === RestoreProfileType.Ledger ? ProfileType.Ledger : ProfileType.Software
        updateOnboardingProfile({ type, restoreProfileType })
        await initialiseProfileManagerFromOnboardingProfile()
        $restoreProfileRouter.next()
    }

    function onBackClick(): void {
        $restoreProfileRouter.previous()
    }

    onMount(async () => {
        // Clean up if user has navigated back to this view
        if ($onboardingProfile.hasInitialisedProfileManager) {
            await destroyProfileManager()
            await removeProfileFolder($onboardingProfile.id)
        }
        updateOnboardingProfile({ type: undefined, restoreProfileType: undefined, hasInitialisedProfileManager: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.onboarding.profileSetup.setupRecovered.title', {
                values: { network: getNetworkNameFromNetworkId(networkId) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupRecovered.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonicDescription')}
            icon={IconEnum.Language}
            busy={isBusy[RestoreProfileType.Mnemonic]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.recoveryPhrase?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importFileDescription')}
            icon={IconEnum.File}
            busy={isBusy[RestoreProfileType.Stronghold]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.strongholdBackup?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Stronghold)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedger')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedgerDescription')}
            icon={IconEnum.Chip}
            busy={isBusy[RestoreProfileType.Ledger]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.ledgerBackup?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.ledgerBackup?.enabled || isDisabled}
            onClick={() => onProfileTypeClick(RestoreProfileType.Ledger)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-purple dark:bg-gray-900">
        <Animation animation={AnimationEnum.ImportDesktop} />
    </div>
</OnboardingLayout>
