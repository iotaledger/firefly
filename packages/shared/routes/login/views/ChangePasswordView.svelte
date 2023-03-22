<script lang="ts">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { updateStrongholdRouter } from '@core/router'

    const busy = false

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }

    function onSkipAndKeepPasswordClick(): void {
        $updateStrongholdRouter.next()
    }

    function onChangePasswordClick(): void {
        $updateStrongholdRouter.next()
    }
</script>

<change-password-view>
    <OnboardingLayout {onBackClick} {busy}>
        <div slot="title">
            <Text type="h2" classes="mb-5">{localize('views.login.changePassword.title')}</Text>
        </div>
        <div slot="leftpane__content">
            <Text type="p" secondary classes="mb-8">{localize('views.login.changePassword.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" secondary onClick={onSkipAndKeepPasswordClick}>
                {localize('actions.skipAndKeepPassword')}
            </Button>
            <Button classes="w-full mt-6" onClick={onChangePasswordClick}>
                {localize('actions.changePassword')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-orange dark:bg-gray-900">
            <Animation animation="password-desktop" />
        </div>
    </OnboardingLayout>
</change-password-view>
