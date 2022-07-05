<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { appRouter } from '@core/router'
    import { downloadRecoveryKit } from '@lib/utils'

    function handleContinueClick(): void {
        $appRouter.next()
    }

    function handleDownloadClick() {
        downloadRecoveryKit()
    }

    function handleBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.secure.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.secure.body1')}</Text>
        <Text type="p" secondary classes="mb-10">{localize('views.secure.body2')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col">
        <Button secondary classes="flex-1 mb-4" onClick={handleDownloadClick}>
            {localize('actions.downloadRecoveryKit')}
        </Button>
        <Button classes="flex-1" onClick={handleContinueClick}>{localize('actions.continue')}</Button>
    </div>
    <!-- Removed animation because this view will soon be combined with Recovery Phrase generation according to Figma docs -->
    <!-- Freed up the animation to use it in OnboardingNetwork.svelte -->
    <!-- <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="secure-desktop" />
    </div> -->
</OnboardingLayout>
