<script lang="typescript">
    import { Animation, Button, ButtonCheckbox, Input, OnboardingLayout, Text, CollapsibleBlock } from 'shared/components'
    import { cleanupSignup } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron'
    import { getTrimmedLength, validateFilenameChars } from 'shared/lib/helpers'
    import { initialiseMigrationListeners } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        cleanupInProgressProfiles,
        createProfile,
        disposeNewProfile,
        hasNoProfiles,
        newProfile,
        profileInProgress,
        profiles,
    } from 'shared/lib/profile'
    import { destroyActor, getStoragePath, initialise, MAX_PROFILE_NAME_LENGTH } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { openPopup } from 'shared/lib/popup';

    export let locale: Locale

    export let mobile
    let error = ''
    let busy = false

    const dispatch = createEventDispatcher()

    let profileName = get(newProfile)?.name ?? ''
    let isDeveloperProfile = get(newProfile)?.isDeveloperProfile ?? false

    $: isProfileNameValid = profileName && profileName.trim()

    // This looks odd but sets a reactive dependency on profileName, so when it changes the error will clear
    $: profileName, (error = '')

    async function handleContinueClick() {
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
            const isDeveloperProfileChanged = $newProfile?.isDeveloperProfile !== isDeveloperProfile

            // If the name has changed from the previous initialization
            // then make sure we cleanup the last profile and actor
            if ((nameChanged || isDeveloperProfileChanged) && previousInitializedId) {
                // The initialized profile name has changed
                // so we need to destroy the previous actor
                destroyActor(previousInitializedId)
            }

            try {
                busy = true

                if (nameChanged || isDeveloperProfileChanged) {
                    profile = createProfile(trimmedProfileName, isDeveloperProfile)
                    profileInProgress.set(trimmedProfileName)

                    const userDataPath = await Electron.getUserDataPath()
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
    }

    async function handleBackClick() {
        cleanupSignup()
        cleanupInProgressProfiles()

        await disposeNewProfile()

        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-4">{locale('views.profile.title')}</Text>
            <Text type="p" secondary classes="mb-4">
                {locale('views.profile.body1')}
            </Text>
            <Text type="p" secondary classes="mb-10">
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
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-green dark:bg-gray-900">
            <Animation animation="profile-desktop" />
        </div>
    </OnboardingLayout>
{/if}
