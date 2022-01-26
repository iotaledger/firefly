<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { Animation,Button,ButtonCheckbox,CollapsibleBlock,Input,OnboardingLayout,Text } from 'shared/components'
    import { cleanupSignup, mobile } from 'shared/lib/app'
    import { getTrimmedLength,validateFilenameChars } from 'shared/lib/helpers'
    import { initialiseMigrationListeners } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { Platform } from 'shared/lib/platform'
    import { openPopup } from 'shared/lib/popup'
    import {
        cleanupInProgressProfiles,
        createProfile,
        disposeNewProfile,
        hasNoProfiles,
        newProfile,
        profileInProgress,
        profiles
    } from 'shared/lib/profile'
    import { destroyActor,getStoragePath,initialise,MAX_PROFILE_NAME_LENGTH } from 'shared/lib/wallet'
    import type { Locale } from 'shared/lib/typings/i18n'
    import type { Profile } from 'shared/lib/typings/profile';

    export let locale: Locale

    let error = ''
    let busy = false

    const dispatch = createEventDispatcher()

    let profileName = $newProfile?.name ?? ''
    let isDeveloperProfile = $newProfile?.isDeveloperProfile ?? false

    $: isProfileNameValid = profileName && profileName.trim()
    $: profileName, (error = '') // Error clears when profileName changes
    $: nameChanged = $newProfile?.name !== profileName.trim()
    $: hasDeveloperProfileChanged = $newProfile?.isDeveloperProfile !== isDeveloperProfile

    async function handleContinueClick(): Promise<void> {
        const trimmedProfileName = profileName.trim()
        try {
            validateProfileName(trimmedProfileName, $profiles)
        } catch (err) {
            return (error = err.message)
        }
        cleanUpIfPreviouslyInitialized()
        await initialiseProfile(trimmedProfileName)
    }

    function cleanUpIfPreviouslyInitialized(): void {
        const previousInitializedId = $newProfile?.id
        if ((nameChanged || hasDeveloperProfileChanged) && previousInitializedId) {
            destroyActor(previousInitializedId)
        }
    }

    async function initialiseProfile(name: string): Promise<void> {
        try {
            busy = true
            if (nameChanged || hasDeveloperProfileChanged) {
                createProfile(name, isDeveloperProfile)
                profileInProgress.set(name)

                const userDataPath = await Platform.getUserDataPath()
                initialise($newProfile.id, getStoragePath(userDataPath, $newProfile.name))
                initialiseMigrationListeners()
            }

            if(isDeveloperProfile) {
                openPopup({type: 'confirmDeveloperProfile', props: {
                    handleContinueClick: () => dispatch('next')
                }})
            } else {
                dispatch('next')
            }

        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale(err.error ? err.error : 'error.global.generic'),
            })
        } finally {
            busy = false
        }
    }

    function validateProfileName(trimmedName: string, profiles: Profile[]): void {
        const validateError = validateFilenameChars(trimmedName)

        if (validateError) {
            throw new Error(locale(`error.account.${validateError}`))
        }

        if (getTrimmedLength(trimmedName) > MAX_PROFILE_NAME_LENGTH) {
            throw new Error(locale('error.profile.length', {
                values: {
                    length: MAX_PROFILE_NAME_LENGTH,
                },
            }))
        }

        if (profiles.some((p) => p.name === trimmedName)) {
            throw new Error(locale('error.profile.duplicate'))
        }
    }

    async function handleBackClick() {
        cleanupSignup()
        cleanupInProgressProfiles()
        await disposeNewProfile()
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{locale('views.profile.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{locale('views.profile.body1')}</Text>
        <Text type="p" secondary classes={$mobile ? 'mb-4' : 'mb-10'}>
            {locale(`views.profile.body2.${hasNoProfiles() ? 'first' : 'nonFirst'}`)}
            {locale('views.profile.addMore')}
        </Text>
        <Input
            {error}
            bind:value={profileName}
            placeholder={locale('views.profile.profileName')}
            classes="w-full mb-6"
            autofocus
            disabled={busy}
            submitHandler={handleContinueClick} />
        <CollapsibleBlock label={locale('views.profile.advancedOptions')} showBlock={get(newProfile)?.isDeveloperProfile ?? false}> 
            <ButtonCheckbox icon="dev" bind:value={isDeveloperProfile}>
                <div class="text-left">
                    <Text type="p">{locale('views.profile.developer.label')}</Text>
                    <Text type="p" secondary>{locale('views.profile.developer.info')}</Text>
                </div>
            </ButtonCheckbox>
        </CollapsibleBlock>
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
