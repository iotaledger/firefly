<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    function handleContinueClick(protectionType: string): void {
        dispatch('next', { protectionType })
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.protect.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.protect.body1')}</Text>
        <Text type="p" secondary highlighted classes="mb-8 font-bold">{localize('views.protect.body2')}</Text>
        <Button
            icon="biometric"
            classes="w-full mb-5"
            secondary
            disabled
            onClick={() => handleContinueClick('biometric')}
        >
            {localize('actions.useBiometric')}
        </Button>
        <Button icon="pin" classes="w-full mb-8" secondary onClick={() => handleContinueClick('pin')}>
            {localize('actions.setupPin')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-end items-center">
        <!-- <Illustration illustration="protect-desktop" height="100%" width="auto" classes="h-full object-cover object-left" /> -->
    </div>
</OnboardingLayout>
