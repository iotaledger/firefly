<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { Locale } from '@core/i18n'
    import { ImportType } from 'shared/lib/typings/profile'
    import { createEventDispatcher } from 'svelte'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    function handleContinueClick(importType: ImportType) {
        dispatch('next', { importType })
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.importFromLedger.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{locale('views.importFromLedger.body')}</Text>
        <Button
            icon="settings"
            classes="w-full mb-5"
            secondary
            onClick={() => handleContinueClick(ImportType.FireflyLedger)}
        >
            {locale('views.importFromLedger.haveFireflyLedger')}
            <Text type="p" secondary smaller>{locale('views.importFromLedger.haveFireflyLedgerDescription')}</Text>
        </Button>
        <Button
            icon="settings"
            classes="w-full mb-8"
            secondary
            onClick={() => handleContinueClick(ImportType.TrinityLedger)}
        >
            {locale('views.importFromLedger.haveTrinityLedger')}
            <Text type="p" secondary smaller>{locale('views.importFromLedger.haveTrinityLedgerDescription')}</Text>
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
