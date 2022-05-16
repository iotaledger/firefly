<script lang="typescript">
    import { cleanupSignup, mobile } from 'shared/lib/app'
    import { Animation, Button, Input, OnboardingLayout, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { getProfileDataPath } from 'shared/lib/wallet'
    import { Locale } from '@core/i18n'
    import { appRouter } from '@core/router'
    import { getDefaultClientOptions, NetworkProtocol, NetworkType } from '@core/network'
    import { newProfile, profiles, validateProfileName, createNewProfile, deleteNewProfile } from '@core/profile'
    import { destroyProfileManager, initialiseProfileManager } from '@core/profile-manager'

    export let locale: Locale

    let error = ''
    let busy = false

    let profileName = $newProfile?.name ?? ''
    const isDeveloperProfile = $newProfile?.isDeveloperProfile

    $: isProfileNameValid = profileName && profileName.trim()
    $: profileName, (error = '') // Error clears when profileName changes
    $: nameChanged = $newProfile?.name !== profileName.trim()

    async function handleContinueClick(): Promise<void> {
        const trimmedProfileName = profileName.trim()
        try {
            validateProfileName(trimmedProfileName)
        } catch (err) {
            return (error = err.message)
        }
        cleanUpIfPreviouslyInitialized()
        await initialiseProfile(trimmedProfileName)
    }

    function cleanUpIfPreviouslyInitialized(): void {
        const previousInitializedId = $newProfile?.id
        if (nameChanged && previousInitializedId) {
            destroyProfileManager()
        }
    }

    async function initialiseProfile(name: string): Promise<void> {
        try {
            busy = true
            if (nameChanged) {
                // TODO: set network based on user selection
                createNewProfile(name, isDeveloperProfile, NetworkProtocol.Shimmer, NetworkType.Devnet)

                const path = await getProfileDataPath($newProfile.id)
                const clientOptions = getDefaultClientOptions(NetworkProtocol.Shimmer, NetworkType.Devnet)
                // const machineId = await Platform.getMachineId()
                // const { sendCrashReports } = $initAppSettings ?? { sendCrashReports: false }
                initialiseProfileManager(path, clientOptions)
                // initialiseMigrationListeners()
            }
            $appRouter.next()
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale(err.error ? err.error : 'error.global.generic'),
            })
        } finally {
            busy = false
        }
    }

    async function handleBackClick(): Promise<void> {
        cleanupSignup()

        await deleteNewProfile()

        $appRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{locale('views.profile.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{locale('views.profile.body1')}</Text>
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-10'}>
            {locale(`views.profile.body2.${$profiles?.length === 0 ? 'first' : 'nonFirst'}`)}
            {locale('views.profile.addMore')}
        </Text>
        <Input
            {error}
            bind:value={profileName}
            placeholder={locale('views.profile.profileName')}
            classes="w-full mb-6"
            autofocus
            disabled={busy}
            submitHandler={handleContinueClick}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-col">
        <Button classes="w-full" disabled={!isProfileNameValid || busy} onClick={handleContinueClick}>
            {locale('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation animation="profile-desktop" />
    </div>
</OnboardingLayout>
