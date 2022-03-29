<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { Locale } from '@core/i18n'
    import { createEventDispatcher } from 'svelte'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    function handleContinueClick(protectionType: string) {
        dispatch('next', { protectionType })
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.protect.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{locale('views.protect.body1')}</Text>
        <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.protect.body2')}</Text>
        <Button
            icon="biometric"
            classes="w-full mb-5"
            secondary
            disabled
            onClick={() => handleContinueClick('biometric')}
        >
            {locale('actions.useBiometric')}
        </Button>
        <Button icon="pin" classes="w-full mb-8" secondary onClick={() => handleContinueClick('pin')}>
            {locale('actions.setupPin')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-end items-center">
        <!-- <Illustration illustration="protect-desktop" height="100%" width="auto" classes="h-full object-cover object-left" /> -->
    </div>
</OnboardingLayout>
