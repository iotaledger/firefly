<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { newProfile, ProfileImportType, ProfileType, setNewProfileType } from '@core/profile'
    import { NetworkProtocol } from '@core/network'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    function handleContinueClick(importType: ProfileImportType) {
        const profileType = importType === ProfileImportType.Ledger ? ProfileType.Ledger : ProfileType.Software
        setNewProfileType(profileType)
        dispatch('next', { importType })
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.import.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.import.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <Button
            icon="seed"
            classes="w-full"
            secondary
            hidden={$newProfile.networkProtocol === NetworkProtocol.Shimmer}
            onClick={() => handleContinueClick(ProfileImportType.Seed)}
        >
            {localize('views.import.importSeed')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.import.importSeedDescription')}</Text>
            {/if}
        </Button>
        <Button
            icon="language"
            classes="w-full"
            secondary
            onClick={() => handleContinueClick(ProfileImportType.Mnemonic)}
        >
            {localize('views.import.importMnemonic')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.import.importMnemonicDescription')}</Text>
            {/if}
        </Button>
        <Button icon="file" classes="w-full" secondary onClick={() => handleContinueClick(ProfileImportType.File)}>
            {localize('views.import.importFile')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.import.importFileDescription')}</Text>
            {/if}
        </Button>
        {#if !$mobile}
            <Button
                icon="chip"
                classes="w-full mb-8"
                secondary
                onClick={() => handleContinueClick(ProfileImportType.Ledger)}
            >
                {localize('views.import.importLedger')}
                {#if !$mobile}
                    <Text type="p" secondary smaller>{localize('views.import.importLedgerDescription')}</Text>
                {/if}
            </Button>
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
