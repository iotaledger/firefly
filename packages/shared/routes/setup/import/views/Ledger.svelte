<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Text } from 'shared/components'
    import { ImportType } from 'shared/lib/profile'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(impType: ImportType) {
        dispatch('next', { impType })
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
            <Text type="h2" classes="mb-5">{locale('views.importFromLedger.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importFromLedger.body')}</Text>
            <Button icon="settings" classes="w-full mb-5" secondary onClick={() => handleContinueClick(ImportType.FireflyLedger)}>
                {locale('views.importFromLedger.haveFireflyLedger')}
                <Text type="p" secondary smaller>{locale('views.importFromLedger.haveFireflyLedgerDescription')}</Text>
            </Button>
            <Button icon="settings" classes="w-full mb-8" secondary onClick={() => handleContinueClick(ImportType.TrinityLedger)}>
                {locale('views.importFromLedger.haveTrinityLedger')}
                <Text type="p" secondary smaller>{locale('views.importFromLedger.haveTrinityLedgerDescription')}</Text>
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Illustration width="100%" illustration="import-from-ledger-desktop" />
        </div>
    </OnboardingLayout>
{/if}
