<script>
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'
    import { OnboardingLayout, Illustration, Text, Button, Input, Checkbox } from 'shared/components'
    import { createProfile, disposeNewProfile, newProfile } from 'shared/lib/profile'
    import { developerMode } from 'shared/lib/app'
    import { initialise, getStoragePath } from 'shared/lib/wallet'
    import { SetupType } from 'shared/lib/typings/routes'

    export let locale
    export let mobile
    let error = ''

    const dispatch = createEventDispatcher()

    let isDeveloperProfile = false
    let profileName = get(newProfile)?.name ?? ''

    const MAX_PROFILE_NAME_LENGTH = 20

    function handleContinueClick(setupType) {
        let profile

        if (profileName.length > MAX_PROFILE_NAME_LENGTH) {
            error = locale('error.profile.nameLength')
        } else {
            try {
                profile = createProfile(profileName, isDeveloperProfile)

                return window['Electron'].getUserDataPath().then((path) => {
                    initialise(profile.id, getStoragePath(path, profile.name))
                    dispatch('next', { setupType })
                })
            } catch (error) {
                console.error(error)
            }
        }
    }

    function handleBackClick() {
        disposeNewProfile();
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-4">{locale('views.setup.title')}</Text>
            <Input error={error} bind:value={profileName} placeholder={locale('views.setup.profile_name')} classes="w-full" />
            {#if $developerMode}
                <Checkbox label={locale('general.developerProfile')} bind:checked={isDeveloperProfile} />
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap items-center space-x-4">
            <Button secondary classes="flex-1" disabled={!profileName} onClick={() => handleContinueClick(SetupType.Import)}>
                {locale('actions.import_wallet')}
            </Button>
            <Button classes="flex-1" disabled={!profileName} onClick={() => handleContinueClick(SetupType.New)}>
                {locale('actions.create_wallet')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="setup-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
