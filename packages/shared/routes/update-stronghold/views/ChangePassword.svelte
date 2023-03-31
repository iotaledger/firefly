<script lang="typescript">
    import { Locale, localize } from '@core/i18n'
    import { tabFormWithEnterKey } from '@lib/keyboard'
    import { Animation, Button, OnboardingLayout, Password, Text, TextHint } from 'shared/components'
    import { getKeyboardTransitionSpeed, isKeyboardOpened, keyboardHeight, mobile } from 'shared/lib/app'
    import passwordInfo from 'shared/lib/password'
    import { api, MAX_PASSWORD_LENGTH } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import zxcvbn from 'zxcvbn'

    export let locale: Locale
    export let currentPassword: string = ''

    const dispatch = createEventDispatcher()

    let newPassword = ''
    let confirmedPassword = ''
    let lastCheckedPassword = ''
    let newPasswordError = ''
    let passwordContainer: HTMLElement

    let busy = false

    $: passwordStrength = checkPasswordStrength(newPassword) ?? passwordStrength
    $: newPassword, confirmedPassword, (newPasswordError = '')
    $: if ($isKeyboardOpened || newPasswordError) {
        setTimeout(() => {
            passwordContainer?.parentElement?.scrollTo(0, passwordContainer?.parentElement?.scrollHeight)
        }, getKeyboardTransitionSpeed($isKeyboardOpened))
    }

    function checkPasswordStrength(password: string): any {
        const NUMBER_OF_STRENGTH_VALIDATION_CHARS = 64
        const limitedPassword = password.substring(0, NUMBER_OF_STRENGTH_VALIDATION_CHARS - 1)
        const hasCheckedPasswordChanged = lastCheckedPassword !== limitedPassword
        if (hasCheckedPasswordChanged) {
            lastCheckedPassword = limitedPassword
            return zxcvbn(limitedPassword)
        }
    } // zxcvbn lib recommends to not validate long passwords because of performance issues https://github.com/dropbox/zxcvbn#user-content-performance

    function onKeyPress(e) {
        tabFormWithEnterKey(e, document, 'change-password-form')
    }

    function handleContinueClick() {
        if (currentPassword && newPassword && confirmedPassword) {
            if (newPassword.length > MAX_PASSWORD_LENGTH) {
                newPasswordError = localize('error.password.length', {
                    values: {
                        length: MAX_PASSWORD_LENGTH,
                    },
                })
            } else if (newPassword !== confirmedPassword) {
                newPasswordError = localize('error.password.doNotMatch')
            } else if (passwordStrength.score !== 4) {
                let errKey = 'error.password.tooWeak'
                if (passwordStrength.feedback.warning && passwordInfo[passwordStrength.feedback.warning]) {
                    errKey = `error.password.${passwordInfo[passwordStrength.feedback.warning]}`
                }
                newPasswordError = localize(errKey)
            } else if (newPassword === currentPassword) {
                newPasswordError = localize('error.password.sameAsOld')
            } else {
                busy = true
                api.changeStrongholdPassword(currentPassword, newPassword, {
                    onSuccess() {
                        dispatch('next', { password: newPassword })
                    },
                    onError(err) {
                        newPasswordError = localize(err.error)
                        busy = false
                    },
                })
            }
        }
    }

    function handleSkipClick(): void {
        dispatch('next')
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type="h2">{localize('views.settings.changePassword.title')}</Text>
    </div>
    <div
        slot="leftpane__content"
        style="flex-auto margin-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: margin-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
        bind:this={passwordContainer}
    >
        <TextHint
            hint={localize('views.updateStronghold.changePassword.hint')}
            icon="exclamation"
            classes="my-4 p-4 w-full rounded-2xl bg-yellow-50 dark:bg-opacity-10"
            iconClasses="text-yellow-700"
        />
        <form on:submit|preventDefault={handleContinueClick} on:keypress={onKeyPress} id="change-password-form">
            <Password
                error={newPasswordError}
                classes="mb-4"
                bind:value={newPassword}
                strengthLevels={4}
                showRevealToggle
                showStrengthLevel
                strength={passwordStrength?.score}
                {locale}
                autofocus={!$mobile}
                placeholder={localize('general.newPassword')}
                disabled={busy}
                submitHandler={handleContinueClick}
            />
            <Password
                classes="mb-5"
                bind:value={confirmedPassword}
                showRevealToggle
                locale={localize}
                placeholder={localize('general.confirmNewPassword')}
                disabled={busy}
                submitHandler={handleContinueClick}
            />
        </form>
    </div>
    <div
        slot="leftpane__action"
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Button secondary classes="w-full mb-4" disabled={busy} onClick={handleSkipClick}>
            {locale('actions.skip')}
        </Button>
        <Button
            type="submit"
            form="change-password-form"
            classes="w-full"
            disabled={!newPassword || !confirmedPassword || busy}
        >
            {locale('actions.continue')}
        </Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden' : 'bg-pastel-yellow dark:bg-gray-900'}"
        style="margin-top: {$mobile && $isKeyboardOpened
            ? -$keyboardHeight
            : 0}px; transition: margin-top {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform ' : ''}"
            animation="backup-recovery-phrase-desktop"
        />
    </div>
</OnboardingLayout>
