<script lang="typescript">
    import { Button, ButtonCheckbox, Illustration, Input, OnboardingLayout, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { cleanupSignup } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron'
    import { getTrimmedLength, validateFilenameChars } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        cleanupInProgressProfiles,
        createProfile,
        disposeNewProfile,
        newProfile,
        profileInProgress,
        profiles,
    } from 'shared/lib/profile'
    import { SetupType } from 'shared/lib/typings/routes'
    import { destroyActor, getStoragePath, initialise, MAX_PROFILE_NAME_LENGTH } from 'shared/lib/wallet'
    import { createEventDispatcher, onMount } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile
    let error = ''
    let busy = false

    const dispatch = createEventDispatcher()

    // TODO: Remove defaulting to dev profile
    let isDeveloperProfile = true
    let profileName = get(newProfile)?.name ?? ''

    $: isProfileNameValid = profileName && profileName.trim()

    // This looks odd but sets a reactive dependency on profileName, so when it changes the error will clear
    $: profileName, (error = '')

    async function handleContinueClick(setupType) {
        const trimmedProfileName = profileName.trim()
        if (trimmedProfileName) {
            let profile
            error = ''

            const validateError = validateFilenameChars(trimmedProfileName)
            if (validateError) {
                return (error = locale(`error.account.${validateError}`))
            }

            if (getTrimmedLength(trimmedProfileName) > MAX_PROFILE_NAME_LENGTH) {
                return (error = locale('error.profile.length', {
                    values: {
                        length: MAX_PROFILE_NAME_LENGTH,
                    },
                }))
            }

            if (get(profiles).some((profile) => profile.name === trimmedProfileName)) {
                return (error = locale('error.profile.duplicate'))
            }

            const previousInitializedId = $newProfile?.id
            const nameChanged = $newProfile?.name !== trimmedProfileName

            // If the name has changed from the previous initialization
            // then make sure we cleanup the last profile and actor
            if (nameChanged && previousInitializedId) {
                // The initialized profile name has changed
                // so we need to destroy the previous actor
                destroyActor(previousInitializedId)
            }

            try {
                busy = true

                if (nameChanged) {
                    profile = createProfile(trimmedProfileName, isDeveloperProfile)
                    profileInProgress.set(trimmedProfileName)

                    const userDataPath = await Electron.getUserDataPath()
                    initialise($newProfile.id, getStoragePath(userDataPath, $newProfile.name))
                }

                dispatch('next', { setupType })
            } catch (err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error ? err.error : 'error.global.generic'),
                })
            } finally {
                busy = false
            }
        }
    }

    async function handleBackClick() {
        cleanupSignup()
        await disposeNewProfile()
        await cleanupInProgressProfiles()
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-4">{locale('views.setup.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.setup.body1')}</Text>
            <Text type="p" secondary classes="mb-10">{locale('views.setup.body2')}</Text>
            <Input
                {error}
                bind:value={profileName}
                placeholder={locale('views.setup.profileName')}
                classes="w-full"
                autofocus
                disabled={busy}
                submitHandler={() => handleContinueClick(SetupType.New)} />
            {#if $appSettings.developerMode}
                <ButtonCheckbox icon="dev" bind:value={isDeveloperProfile}>{locale('general.developerProfile')}</ButtonCheckbox>
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-col">
            <Button
                secondary
                classes="flex-1 mb-4"
                disabled={!isProfileNameValid || busy}
                onClick={() => handleContinueClick(SetupType.Import)}>
                {locale('actions.importWallet')}
            </Button>
            <Button classes="flex-1" disabled={!isProfileNameValid || busy} onClick={() => handleContinueClick(SetupType.New)}>
                {locale('actions.createWallet')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16 bg-pastel-green dark:bg-gray-900">
            <Illustration illustration="setup-desktop" width="100%" height="auto" classes="object-cover" />
        </div>
    </OnboardingLayout>
{/if}
