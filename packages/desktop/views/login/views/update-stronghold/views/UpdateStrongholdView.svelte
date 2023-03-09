<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { Animation, Button, PasswordInput, Text } from '@ui'
    import { HTMLButtonType, TextType } from '@ui/enums'

    import { localize } from '@core/i18n'
    import { unlockStronghold } from '@core/profile'
    import { updateStrongholdRouter } from '@core/router'

    export let password: string = ''
    export let isRecovery: boolean = false

    let passwordError: string = ''

    async function onSubmit(): Promise<void> {
        try {
            await unlockStronghold(password)
            $updateStrongholdRouter.next()
        } catch (err) {
            passwordError = localize(err.message) ?? err.message
            return
        }
    }

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>
            {localize('views.updateStronghold.update.title')}
        </Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-12">
            {localize('views.updateStronghold.update.body')}
        </Text>
        <form on:submit|preventDefault={onSubmit} id="update-stronghold-form">
            <PasswordInput bind:value={password} bind:error={passwordError} autofocus showRevealToggle />
        </form>
    </div>
    <div slot="leftpane__action">
        <Button
            type={HTMLButtonType.Submit}
            form="update-stronghold-form"
            classes="w-full"
            disabled={!password || !!passwordError}
        >
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
