<script lang="ts">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '@components'
    import { Button, Input, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'
    import { profiles, validateProfileName } from '@core/profile'
    import { profileRecoveryRouter, profileSetupRouter } from '@/routers'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'

    let error = ''
    let profileName = $onboardingProfile?.name ?? ''

    $: isProfileNameValid = profileName && profileName.trim()
    $: profileName, (error = '') // Error clears when profileName changes
    $: title = localize('views.onboarding.profileSetup.enterName.title', {
        values: { protocol: formatProtocolName($onboardingProfile?.network?.id) },
    })

    function onBackClick(): void {
        if ($onboardingProfile?.recoveryType) {
            $profileRecoveryRouter.resetRecovery()
        } else {
            $profileSetupRouter.previous()
        }
        updateOnboardingProfile({ mustVisitProfileName: true })
    }

    function onContinueClick(): void {
        try {
            validateProfileName(profileName)
            updateOnboardingProfile({ name: profileName })
            $profileSetupRouter.next()
        } catch (err) {
            error = err.message
        }
    }

    onMount(() => {
        updateOnboardingProfile({ mustVisitProfileName: false })
    })
</script>

<OnboardingLayout {onBackClick} {title} animation="profile-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary fontSize="15" classes="mb-4"
            >{localize('views.onboarding.profileSetup.enterName.body1')}</Text
        >
        <Text type={TextType.p} secondary fontSize="15" classes="mb-4">
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
    <div slot="footer" class="flex flex-col">
        <Button classes="w-full" disabled={!isProfileNameValid} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
</OnboardingLayout>
