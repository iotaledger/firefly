<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from '@shared-components'
    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick(type) {
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
            <Text type="h1" classes="mb-5">{locale('views.import.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import.body')}</Text>
            <Button icon="doc" classes="w-full mb-5" secondary onClick={() => handleContinueClick('text')}>
                {locale('general.have_text_backup')}
                <Text type="p" secondary>{locale('general.enter_seed_or_phrase')}</Text>
            </Button>
            <Button icon="doc" classes="w-full mb-8" secondary onClick={() => handleContinueClick('file')}>
                {locale('general.have_file_backup')}
                <Text type="p" secondary>{locale('general.upload_seedvault_or_stronghold')}</Text>
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="import-desktop" />
        </div>
    </OnboardingLayout>
{/if}
