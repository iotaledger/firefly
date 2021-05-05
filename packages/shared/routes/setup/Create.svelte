<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    enum AccountType {
        Software = 'Software',
        Ledger = 'Ledger',
    }

    function handleContinueClick(accountType: AccountType) {
        dispatch('next', { accountType })
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
            <Button icon="settings" classes="w-full mb-5" secondary onClick={() => handleContinueClick(AccountType.Software)}>
                {locale('views.create.software_account.title')}
                <Text type="p" secondary smaller>{locale('views.create.software_account.description')}</Text>
            </Button>
            <Button icon="settings" classes="w-full mb-8" secondary onClick={() => handleContinueClick(AccountType.Ledger)}>
                {locale('views.create.ledger_account.title')}
                <Text type="p" secondary smaller>{locale('views.create.ledger_account.description')}</Text>
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Illustration width="100%" illustration="import-from-ledger-desktop" />
        </div>
    </OnboardingLayout>
{/if}
