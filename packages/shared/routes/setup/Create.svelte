<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Text } from 'shared/components'
    import { ProfileType, setProfileType } from 'shared/lib/profile'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(profileType: ProfileType) {
        setProfileType(profileType)
        dispatch('next')
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
            <Text type="h2" classes="mb-5">{locale('views.create.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.create.body')}</Text>
            <Button icon="settings" classes="w-full mb-5" secondary onClick={() => handleContinueClick(ProfileType.Software)}>
                {locale('views.create.softwareAccount.title')}
                <Text type="p" secondary smaller>{locale('views.create.softwareAccount.description')}</Text>
            </Button>
            <Button icon="settings" classes="w-full mb-8" secondary onClick={() => handleContinueClick(ProfileType.Ledger)}>
                {locale('views.create.ledgerAccount.title')}
                <Text type="p" secondary smaller>{locale('views.create.ledgerAccount.description')}</Text>
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Illustration width="100%" illustration="import-from-ledger-desktop" />
        </div>
    </OnboardingLayout>
{/if}
