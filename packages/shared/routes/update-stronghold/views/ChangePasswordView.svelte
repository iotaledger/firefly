<script lang="ts">
    import zxcvbn from 'zxcvbn'
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text, TextHint } from 'shared/components'
    import { localize } from '@core/i18n'
    import { updateStrongholdRouter } from '@core/router'
    import { showAppNotification } from '@lib/notifications'
    import passwordInfo from '@lib/password'
    import { asyncChangeStrongholdPassword, MAX_PASSWORD_LENGTH } from '@lib/wallet'
    import { strongholdPassword } from '@lib/app'

    let password = ''
    let error = ''
    let confirmPassword = ''
    let errorConfirm = ''
    let busy = false

    $: passwordStrength = zxcvbn(password)
    $: password, confirmPassword, ((error = ''), (errorConfirm = ''))

    function onSkipAndKeepPasswordClick(): void {
        $updateStrongholdRouter.next()
    }

    async function onChangePasswordClick(): Promise<void> {
        error = ''
        errorConfirm = ''

        if (password.length > MAX_PASSWORD_LENGTH) {
            error = localize('error.password.length', {
                values: {
                    length: MAX_PASSWORD_LENGTH,
                },
            })
        } else if (passwordStrength.score !== 4) {
            let errKey = 'error.password.tooWeak'
            if (passwordStrength.feedback.warning && passwordInfo[passwordStrength.feedback.warning]) {
                errKey = `error.password.${passwordInfo[passwordStrength.feedback.warning]}`
            }
            error = localize(errKey)
        } else if (password !== confirmPassword) {
            errorConfirm = localize('error.password.doNotMatch')
        } else if (password === $strongholdPassword) {
            errorConfirm = localize('error.password.notNew')
        } else {
            try {
                busy = true
                await asyncChangeStrongholdPassword($strongholdPassword, password)
                strongholdPassword.set(password)
                await $updateStrongholdRouter.next()
            } catch (err) {
                showAppNotification({
                    type: 'error',
                    message: localize(err.error),
                })
            } finally {
                busy = false
            }
        }
    }
</script>

<change-password-view>
    <OnboardingLayout allowBack={false}>
        <div slot="title">
            <Text type="h2" classes="mb-5">{localize('views.login.changePassword.title')}</Text>
        </div>
        <div slot="leftpane__content">
            <TextHint
                hint={localize('views.login.changePassword.hint')}
                hintClasses="text-gray-700 dark:text-gray-400"
                icon="exclamation"
                classes="mb-12 p-4 w-full rounded-2xl bg-yellow-50 dark:bg-opacity-10"
                iconClasses="text-yellow-700"
            />
            <Password
                {error}
                classes="mb-4"
                bind:value={password}
                strengthLevels={4}
                showRevealToggle
                showStrengthLevel
                strength={passwordStrength.score}
                locale={localize}
                autofocus
                disabled={busy}
            />
            <Password
                error={errorConfirm}
                bind:value={confirmPassword}
                classes="mb-5"
                locale={localize}
                placeholder={localize('general.confirmPassword')}
                showRevealToggle
                disabled={busy}
            />
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" secondary disabled={busy} onClick={onSkipAndKeepPasswordClick}>
                {localize('actions.skipAndKeepPassword')}
            </Button>
            <Button classes="w-full mt-6" disabled={busy || !password} onClick={onChangePasswordClick}>
                {#if busy}
                    <Spinner busy message={localize('actions.changingPassword')} classes="justify-center" />
                {:else}
                    {localize('actions.changePassword')}
                {/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-orange dark:bg-gray-900">
            <Animation animation="password-desktop" />
        </div>
    </OnboardingLayout>
</change-password-view>
