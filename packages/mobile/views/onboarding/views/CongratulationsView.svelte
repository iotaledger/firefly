<script lang="typescript">
    import { OnboardingLayout } from '../../../components'
    import { Button, Icon, Text, TextType } from 'shared/components'
    import { onboardingRouter } from '../../../lib/routers'
    import { localize } from '@core/i18n'
    import { completeOnboardingProcess } from '@contexts/onboarding'

    function onContinueClick(): Promise<void> {
        completeOnboardingProcess()
        $onboardingRouter.next()
        return Promise.resolve()
    }
</script>

<OnboardingLayout allowBack={false} animation="congratulations-desktop">
    <div slot="content" class="flex flex-col space-y-6">
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type={TextType.h2} classes="mb-5 text-center"
                >{localize('views.onboarding.congratulations.title')}</Text
            >
            <Text type={TextType.p} secondary classes="mb-2 text-center"
                >{localize('views.onboarding.congratulations.body')}</Text
            >
        </div>
    </div>
    <div slot="footer">
        <Button autofocus classes="w-full" onClick={onContinueClick}>
            {localize('actions.finishSetup')}
        </Button>
    </div>
</OnboardingLayout>
