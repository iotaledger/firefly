<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { RestoreProfileType, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { getNetworkNameFromNetworkId } from '@core/network'
    import { profiles, validateProfileName, DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES } from '@core/profile'
    import { Animation, Button, Input, Text } from '@ui'
    import { completeOnboardingRouter } from '../complete-onboarding-router'
    import { handleError } from '@core/error/handlers'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'

    let error = ''
    let profileName = $onboardingProfile?.name ?? ''

    $: isProfileNameValid = profileName && profileName.trim()
    $: profileName, (error = '') // Error clears when profileName changes

    function onContinueClick(): void {
        try {
            if ($onboardingProfile.restoreProfileType === RestoreProfileType.Stronghold) {
                const MILLISECONDS_TO_EXPIRE_STRONGHOLD_PASSWORD =
                    DEFAULT_STRONGHOLD_PASSWORD_TIMEOUT_IN_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND
                const isStrongholdPasswordExpired =
                    new Date().getTime() - $onboardingProfile?.timeStrongholdLastUnlocked?.getTime() >
                    MILLISECONDS_TO_EXPIRE_STRONGHOLD_PASSWORD
                if (isStrongholdPasswordExpired) {
                    handleError({ message: localize('views.settings.strongholdPasswordTimeout.description') })
                    throw new Error()
                }
            }
            validateProfileName(profileName)
            updateOnboardingProfile({ name: profileName })
            $completeOnboardingRouter.next()
        } catch (err) {
            error = err.message
        }
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.onboarding.profileSetup.enterName.title', {
                values: { network: getNetworkNameFromNetworkId($onboardingProfile?.network?.id) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.onboarding.profileSetup.enterName.body1')}</Text>
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-10'}>
            {localize(
                `views.onboarding.profileSetup.enterName.body2.${$profiles?.length === 0 ? 'first' : 'nonFirst'}`
            )}
            {localize('views.onboarding.profileSetup.enterName.addMore')}
        </Text>
        <Input
            {error}
            bind:value={profileName}
            placeholder={localize('views.onboarding.profileSetup.enterName.profileName')}
            classes="w-full mb-6"
            autofocus
            submitHandler={onContinueClick}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-col">
        <Button classes="w-full" disabled={!isProfileNameValid} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="profile-desktop" />
    </div>
</OnboardingLayout>
