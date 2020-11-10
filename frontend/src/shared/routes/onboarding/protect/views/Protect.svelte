<script lang="typescript">
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
            <Text type="h1" classes="mb-5">{locale('views.protect.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.protect.body_1')}</Text>
            <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.protect.body_2')}</Text>
            <Button icon="biometric" classes="w-full mb-5" secondary onClick={() => handleContinueClick('biometric')}>
                {locale('actions.use_biometric')}
            </Button>
            <Button icon="pin" classes="w-full mb-8" secondary onClick={() => handleContinueClick('pin')}>
                {locale('actions.setup_pin')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="protect-desktop" />
        </div>
    </OnboardingLayout>
{/if}
