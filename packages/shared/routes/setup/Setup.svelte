<script lang="typescript">
    import { Button, Checkbox, Illustration, Input, OnboardingLayout, Text, Icon } from 'shared/components'
    import { developerMode } from 'shared/lib/app'
    import { Electron } from 'shared/lib/electron'
    import { hasOnlyWhitespaces } from 'shared/lib/helpers'
    import { createProfile, disposeNewProfile, newProfile, profiles } from 'shared/lib/profile'
    import { SetupType } from 'shared/lib/typings/routes'
    import { getStoragePath, initialise, api, MAX_PROFILE_NAME_LENGTH } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile
    let error = ''

    const dispatch = createEventDispatcher()

    // TODO: Remove defaulting to dev profile
    let isDeveloperProfile = true
    let profileName = get(newProfile)?.name ?? ''

    $: isProfileNameValid = profileName && !hasOnlyWhitespaces(profileName)

    function handleContinueClick(setupType) {
        if (profileName) {
            let profile
            error = ''

            if (profileName.length > MAX_PROFILE_NAME_LENGTH) {
                return (error = locale('error.profile.length', {
                    values: {
                        length: MAX_PROFILE_NAME_LENGTH,
                    },
                }))
            }

            if (get(profiles).some((profile) => profile.name === profileName)) {
                return (error = locale('error.profile.duplicate'))
            }

            profile = createProfile(profileName, isDeveloperProfile)

            return Electron.getUserDataPath().then((path) => {
                initialise(profile.id, getStoragePath(path, profile.name))
                api.setStrongholdPasswordClearInterval({ secs: 0, nanos: 0 })

                dispatch('next', { setupType })
            })
        }
    }

    function handleBackClick() {
        disposeNewProfile()
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-4">{locale('views.setup.title')}</Text>
            <Text type="p" secondary classes="mb-10">{locale('views.setup.body1')}</Text>
            <Text type="p" secondary classes="mb-10">{locale('views.setup.body2')}</Text>
            <Input
                {error}
                bind:value={profileName}
                placeholder={locale('views.setup.profileName')}
                classes="w-full"
                autofocus
                submitHandler={() => handleContinueClick(SetupType.New)} />
            {#if $developerMode}
                <button
                    on:click={() => (isDeveloperProfile = !isDeveloperProfile)}
                    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 hover:border-gray-500 focus:border-gray-500">
                    <div class="flex flex-row items-center">
                        <Icon icon="dev" classes="text-blue-500" />
                        <Text smaller classes="ml-3">{locale('general.developerProfile')}</Text>
                    </div>
                    <Checkbox bind:checked={isDeveloperProfile} classes="mb-0 pointer-events-none" tabindex={-1} />
                </button>
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-col">
            <Button secondary classes="mb-4" disabled={!isProfileNameValid} onClick={() => handleContinueClick(SetupType.Import)}>
                {locale('actions.importWallet')}
            </Button>
            <Button classes="flex-1" disabled={!isProfileNameValid} onClick={() => handleContinueClick(SetupType.New)}>
                {locale('actions.createWallet')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16" style="background-color: #F7FFED">
            <Illustration illustration="setup-desktop" width="auto" height="auto" />
        </div>
    </OnboardingLayout>
{/if}
