<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { ImportType, ProfileType, setProfileType } from 'shared/lib/profile'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(type: ImportType) {
        const profileType = type === ImportType.Ledger ? ProfileType.Ledger : ProfileType.Software
        setProfileType(profileType)
        dispatch('next', { type })
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
            <Text type="h2" classes="mb-5">{locale('views.import.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import.body')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            <Button icon="seed" classes="w-full" secondary onClick={() => handleContinueClick(ImportType.Seed)}>
                {locale('views.import.importSeed')}
                <Text type="p" secondary smaller>{locale('views.import.importSeedDescription')}</Text>
            </Button>
            <Button icon="language" classes="w-full" secondary onClick={() => handleContinueClick(ImportType.Mnemonic)}>
                {locale('views.import.importMnemonic')}
                <Text type="p" secondary smaller>{locale('views.import.importMnemonicDescription')}</Text>
            </Button>
            <Button icon="doc" classes="w-full" secondary onClick={() => handleContinueClick(ImportType.File)}>
                {locale('views.import.importFile')}
                <Text type="p" secondary smaller>{locale('views.import.importFileDescription')}</Text>
            </Button>
            <Button icon="chip" classes="w-full mb-8" secondary onClick={() => handleContinueClick(ImportType.Ledger)}>
                {locale('views.import.importLedger')}
                <Text type="p" secondary smaller>{locale('views.import.importLedgerDescription')}</Text>
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-purple dark:bg-gray-900">
            <Animation animation="import-desktop" />
        </div>
    </OnboardingLayout>
{/if}
