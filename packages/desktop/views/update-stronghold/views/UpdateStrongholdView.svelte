<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { Animation, Button, PasswordInput, Text } from '@ui'
    import { HTMLButtonType, TextType } from '@ui/enums'

    import { localize } from '@core/i18n'
    import { updateStrongholdRouter } from '@core/router'

    import { onboardingProfile } from '@contexts/onboarding'
    import { updateStronghold } from '@core/profile-manager'
    import { isValidJson } from '@core/utils'

    export let password: string = ''
    export let isRecovery: boolean = false

    let passwordError: string = ''
    let isBusy = false

    $: isPasswordInputVisible = !isRecovery

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            if (isRecovery && isPasswordInputVisible) {
                $onboardingProfile.strongholdPassword = password
            }
            await updateStronghold(password, isRecovery)
            isBusy = false
            $updateStrongholdRouter.next()
        } catch (err) {
            isBusy = false
            if (isRecovery) {
                isPasswordInputVisible = true
            }
            const parsedError = isValidJson(err.message) ? JSON.parse(err.message) : null
            passwordError = parsedError?.payload?.error.replaceAll('`', '') ?? localize(err.message)
            return
        }
    }

    function onBackClick(): void {
        $updateStrongholdRouter.previous()
    }

    onMount(() => {
        if (isRecovery) {
            password = $onboardingProfile.strongholdPassword
        }
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>
            {localize('views.updateStronghold.update.title')}
        </Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-12">
            {localize(`views.updateStronghold.update.${isRecovery ? 'recoveryBody' : 'loginBody'}`)}
        </Text>
        <form on:submit|preventDefault={onSubmit} id="update-stronghold-form">
            <PasswordInput
                bind:value={password}
                bind:error={passwordError}
                autofocus
                showRevealToggle
                classes={isPasswordInputVisible ? '' : 'invisible'}
            />
        </form>
    </div>
    <div slot="leftpane__action">
        <Button
            type={HTMLButtonType.Submit}
            form="update-stronghold-form"
            classes="w-full"
            disabled={isBusy || !password || !!passwordError}
            {isBusy}
        >
            {localize('actions.updateAndContinue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
