<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Password, Text } from 'shared/components'
    import {
        mobile,
        isKeyboardOpened,
        keyboardHeight,
        strongholdPassword,
        getKeyboardTransitionSpeed,
    } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { tabFormWithEnterKey } from '@lib/keyboard'
    import passwordInfo from 'shared/lib/password'
    import { asyncChangeStrongholdPassword, asyncSetStrongholdPassword, MAX_PASSWORD_LENGTH } from 'shared/lib/wallet'
    import zxcvbn from 'zxcvbn'
    import { Locale } from '@core/i18n'
    import { appRouter } from '@core/router'

    export let locale: Locale

    const existingPassword = $strongholdPassword
    let password = ''
    let confirmedPassword = ''
    let lastCheckedPassword = ''
    let error = ''
    let errorConfirm = ''
    let busy = false
    let passwordContainer: HTMLElement

    $: passwordStrength = checkPasswordStrength(password) ?? passwordStrength
    $: password, confirmedPassword, ((error = ''), (errorConfirm = ''))
    $: if ($isKeyboardOpened || error || errorConfirm) {
        setTimeout(() => {
            passwordContainer?.parentElement?.scrollTo(0, passwordContainer?.parentElement?.scrollHeight)
        }, getKeyboardTransitionSpeed($isKeyboardOpened))
    }

    async function handleContinueClick(): Promise<void> {
        error = ''
        errorConfirm = ''

        if (password.length > MAX_PASSWORD_LENGTH) {
            error = locale('error.password.length', {
                values: {
                    length: MAX_PASSWORD_LENGTH,
                },
            })
        } else if (passwordStrength?.score !== 4) {
            let errKey = 'error.password.tooWeak'
            if (passwordStrength?.feedback.warning && passwordInfo[passwordStrength?.feedback.warning]) {
                errKey = `error.password.${passwordInfo[passwordStrength?.feedback.warning]}`
            }
            error = locale(errKey)
        } else if (password !== confirmedPassword) {
            errorConfirm = locale('error.password.doNotMatch')
        } else {
            try {
                busy = true
                if (existingPassword) {
                    await asyncChangeStrongholdPassword(existingPassword, password)
                } else {
                    await asyncSetStrongholdPassword(password)
                }

                $appRouter.next({ password })
            } catch (err) {
                showAppNotification({
                    type: 'error',
                    message: locale(err.error),
                })
            } finally {
                busy = false
            }
        }
    }
    function handleBackClick(): void {
        $appRouter.previous()
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
        tabFormWithEnterKey(e, document, 'set-password')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{locale('views.password.title')}</Text>
    </div>
    <div
        slot="leftpane__content"
        style="margin-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: margin-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
        bind:this={passwordContainer}
    >
        <form
            on:submit|preventDefault={handleContinueClick}
            on:keypress={onKeyPress}
            id="password-form"
            name="set-password"
        >
            <Text type="p" classes="mb-4" secondary>{locale('views.password.body1')}</Text>
            <Text type="p" classes="mb-10" secondary>{locale('views.password.body2')}</Text>
            <Password
                {error}
                classes="mb-4"
                bind:value={password}
                strengthLevels={4}
                showRevealToggle
                showStrengthLevel
                strength={passwordStrength?.score}
                {locale}
                autofocus={!$mobile}
                disabled={busy}
            />
            <Password
                error={errorConfirm}
                bind:value={confirmedPassword}
                classes="mb-5"
                {locale}
                placeholder={locale('general.confirmPassword')}
                showRevealToggle
                disabled={busy}
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
        <Button type="submit" form="password-form" classes="w-full" disabled={!password || !confirmedPassword || busy}>
            {locale('actions.savePassword')}
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
        <Animation classes="setup-anim-aspect-ratio {$mobile ? 'transform ' : ''}" animation="password-desktop" />
    </div>
</OnboardingLayout>
