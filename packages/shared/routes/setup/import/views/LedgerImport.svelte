<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    enum LedgerApp {
        Trinity = 'Trinity',
        Firefly = 'Firefly'
    }

    function handleContinueClick(app: LedgerApp) {
        dispatch('next', { app })
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
        <Text type="h2" classes="mb-5">{locale('views.import_from_ledger.title')}</Text>
        <Text type="p" secondary classes="mb-8">{locale('views.import_from_ledger.body')}</Text>
        <Button icon="settings" classes="w-full mb-5" secondary onClick={()=> handleContinueClick(LedgerApp.Firefly)}>
            {locale('views.import_from_ledger.have_firefly_ledger')}
            <Text type="p" secondary smaller>{locale('views.import_from_ledger.have_firefly_ledger_description')}</Text>
        </Button>
        <Button icon="settings" classes="w-full mb-8" secondary onClick={()=> handleContinueClick(LedgerApp.Trinity)}>
            {locale('views.import_from_ledger.have_trinity_ledger')}
            <Text type="p" secondary smaller>{locale('views.import_from_ledger.have_trinity_ledger_description')}</Text>
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-end items-center">
        <Illustration width="100%" illustration="import-from-ledger-desktop" />
    </div>
</OnboardingLayout>
{/if}
