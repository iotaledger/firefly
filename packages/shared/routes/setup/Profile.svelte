<script lang="typescript">
    import { mobile } from '@core/app'
    import { Animation, Button, Input, OnboardingLayout, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { localize } from '@core/i18n'
    import { appRouter } from '@core/router'
    import { newProfile, profiles, validateProfileName, updateNewProfile } from '@core/profile'

    let error = ''
    let profileName = $newProfile?.name ?? ''

    $: trimmedProfileName = profileName.trim()
    $: isProfileNameValid = profileName && trimmedProfileName
    $: hasNameChanged = $newProfile?.name !== trimmedProfileName
    $: profileName, (error = '')
    $: {
        if (error) {
            showAppNotification({
                type: 'error',
                message: localize(error ? error : 'error.global.generic'),
            })
        }
    }

    function handleContinueClick(): void {
        try {
            if (hasNameChanged) {
                validateProfileName(trimmedProfileName)
                hasNameChanged && updateNewProfile({ name: trimmedProfileName })
            }
            $appRouter.next()
        } catch (err) {
            return (error = err.message)
        }
    }

    function handleBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
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
