<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { setProfileType } from 'shared/lib/profile'
    import { Locale } from '@core/i18n'
    import { ImportType, ProfileType } from 'shared/lib/typings/profile'
    import { createEventDispatcher } from 'svelte'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    function handleContinueClick(importType: ImportType) {
        const profileType = importType === ImportType.Ledger ? ProfileType.Ledger : ProfileType.Software
        setProfileType(profileType)
        dispatch('next', { importType })
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.import.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{locale('views.import.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <Button icon="seed" classes="w-full" secondary onClick={() => handleContinueClick(ImportType.Seed)}>
            {locale('views.import.importSeed')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{locale('views.import.importSeedDescription')}</Text>
            {/if}
        </Button>
        <Button icon="language" classes="w-full" secondary onClick={() => handleContinueClick(ImportType.Mnemonic)}>
            {locale('views.import.importMnemonic')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{locale('views.import.importMnemonicDescription')}</Text>
            {/if}
        </Button>
        <Button icon="doc" classes="w-full" secondary onClick={() => handleContinueClick(ImportType.File)}>
            {locale('views.import.importFile')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{locale('views.import.importFileDescription')}</Text>
            {/if}
        </Button>
        {#if !$mobile}
            <Button icon="chip" classes="w-full mb-8" secondary onClick={() => handleContinueClick(ImportType.Ledger)}>
                {locale('views.import.importLedger')}
                {#if !$mobile}
                    <Text type="p" secondary smaller>{locale('views.import.importLedgerDescription')}</Text>
                {/if}
            </Button>
        {/if}
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden ' : 'bg-pastel-purple dark:bg-gray-900'}"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation="import-desktop"
        />
    </div>
</OnboardingLayout>
