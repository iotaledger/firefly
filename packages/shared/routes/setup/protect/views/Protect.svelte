<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'
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
            <Text type="h2" classes="mb-5">{locale('views.protect.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.protect.body_1')}</Text>
            <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.protect.body_2')}</Text>
            <Button icon="biometric" classes="w-full mb-5" secondary disabled onClick={() => handleContinueClick('biometric')}>
                {locale('actions.use_biometric')}
            </Button>
            <Button icon="pin" classes="w-full mb-8" secondary onClick={() => handleContinueClick('pin')}>
                {locale('actions.setup_pin')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="protect-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
