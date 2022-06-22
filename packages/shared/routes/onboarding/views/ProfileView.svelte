<script lang="typescript">
    import { mobile } from '@core/app'
    import { Animation, Button, Input, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'
    import { newProfile, profiles, updateNewProfile, validateProfileName } from '@core/profile'
    import { appRouter } from '@core/router'
    import { cleanupOnboarding } from '@contexts/onboarding'

    let error = ''
    let profileName = $newProfile?.name ?? ''

    $: isProfileNameValid = profileName && profileName.trim()
    $: profileName, (error = '') // Error clears when profileName changes

    async function handleBackClick(): Promise<void> {
        const isDeveloperProfile = $newProfile.isDeveloperProfile
        const networkProtocol = $newProfile.networkProtocol
        await cleanupOnboarding(true)
        updateNewProfile({ isDeveloperProfile, networkProtocol })
        $appRouter.previous()
    }

    function handleContinueClick(): void {
        try {
            validateProfileName(profileName)
            updateNewProfile({ name: profileName })
            $appRouter.next()
        } catch (err) {
            error = err.message
        }
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.profile.title', {
                values: { protocol: formatProtocolName($newProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.profile.body1')}</Text>
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-10'}>
            {localize(`views.profile.body2.${$profiles?.length === 0 ? 'first' : 'nonFirst'}`)}
            {localize('views.profile.addMore')}
        </Text>
        <Input
            {error}
            bind:value={profileName}
            placeholder={localize('views.profile.profileName')}
            classes="w-full mb-6"
            autofocus
            submitHandler={handleContinueClick}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-col">
        <Button classes="w-full" disabled={!isProfileNameValid} onClick={handleContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation animation="profile-desktop" />
    </div>
</OnboardingLayout>
