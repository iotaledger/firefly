<script lang="typescript">
    import { mobile } from '@core/app'
    import { Animation, Button, Input, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { appRouter } from '@core/router'
    import { newProfile, profiles } from '@core/profile'
    import { cleanupOnboarding, initializeProfile } from '@contexts/onboarding'

    let error = ''
    const busy = false

    let profileName = $newProfile?.name ?? ''
    const isDeveloperProfile = $newProfile?.isDeveloperProfile

    $: isProfileNameValid = profileName && profileName.trim()
    $: profileName, (error = '') // Error clears when profileName changes
    $: nameChanged = $newProfile?.name !== profileName.trim()

    async function handleBackClick(): Promise<void> {
        await cleanupOnboarding()

        $appRouter.previous()
    }

    async function handleContinueClick(): Promise<void> {
        await initializeProfile(profileName)

        $appRouter.next()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{localize('views.profile.title')}</Text>
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
            disabled={busy}
            submitHandler={handleContinueClick}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-col">
        <Button classes="w-full" disabled={!isProfileNameValid || busy} onClick={handleContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation animation="profile-desktop" />
    </div>
</OnboardingLayout>
