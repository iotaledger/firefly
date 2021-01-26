<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button, Input, Radio } from 'shared/components'
    import { createProfile, setActiveProfile } from 'shared/lib/app'
    import { initialise } from 'shared/lib/wallet'
    import { SetupType } from 'shared/lib/router'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    let profileName = ''
    let mainnet = true

    const MAX_PROFILE_NAME_LENGTH = 250

    function handleContinueClick(setupType) {
        // TOOD (laumair): What happens if a user cancels at this point? We need to detect and remove this profile.
        let profile

        if (profileName.length > MAX_PROFILE_NAME_LENGTH) {
            console.error('Profile name too long.')
        } else {
            try {
                profile = createProfile(profileName)
                setActiveProfile(profile.id)

                initialise(profile.id, profile.name)

                dispatch('next', { setupType })
            } catch (error) {
                console.error(error)
            }
        }
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-4">{locale('views.setup.title')}</Text>
            <Input bind:value={profileName} placeholder="Profile Name" classes="w-full mb-4" />
            <Radio value={true} bind:group={mainnet} label="Mainnet Account" classes="mb-4" />
            <Radio value={false} bind:group={mainnet} label="Testnet Account" classes="mb-4" />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center gap-4">
            <Button secondary classes="flex-auto" onClick={() => handleContinueClick(SetupType.Import)}>
                {locale('actions.import_wallet')}
            </Button>
            <Button classes="flex-auto" disabled={!profileName} onClick={() => handleContinueClick(SetupType.New)}>
                {locale('actions.create_wallet')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="setup-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
