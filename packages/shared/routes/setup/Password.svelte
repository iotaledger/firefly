<script lang="typescript">
    import { showAppNotification } from 'shared/lib/notifications'
    import { Button, Illustration, OnboardingLayout, Password, Text } from 'shared/components'
    import passwordInfo from 'shared/lib/password'
    import { asyncSetStrongholdPassword, MAX_PASSWORD_LENGTH } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'
    import zxcvbn from 'zxcvbn'

    export let locale
    export let mobile

    let password = ''
    let confirmedPassword = ''
    let error = ''
    let busy = false

    const dispatch = createEventDispatcher()

    $: passwordStrength = zxcvbn(password)

    async function handleContinueClick() {
        if (password.length > MAX_PASSWORD_LENGTH) {
            error = locale('error.password.length', {
                values: {
                    length: MAX_PASSWORD_LENGTH,
                },
            })
        } else if (password !== confirmedPassword) {
            error = locale('error.password.doNotMatch')
        } else if (passwordStrength.score !== 4) {
            error = passwordStrength.feedback.warning
                ? locale(`error.password.${passwordInfo[passwordStrength.feedback.warning]}`)
                : locale('error.password.tooWeak')
        } else {
            try {
                busy = true
                await asyncSetStrongholdPassword(password)

                dispatch('next', { password })
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
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <form on:submit={handleContinueClick} id="password-form">
                <Text type="h2" classes="mb-6">{locale('views.password.title')}</Text>
                <Text type="p" classes="mb-4" secondary>{locale('views.password.body1')}</Text>
                <Text type="p" classes="mb-10" secondary>{locale('views.password.body2')}</Text>
                <Password
                    {error}
                    classes="mb-4"
                    bind:value={password}
                    strengthLevels={4}
                    showRevealToggle
                    showStrengthLevel
                    strength={passwordStrength.score}
                    {locale}
                    autofocus
                    disabled={busy} />
                <Password
                    bind:value={confirmedPassword}
                    classes="mb-5"
                    {locale}
                    placeholder={locale('general.confirmPassword')}
                    showRevealToggle
                    disabled={busy} />
            </form>
        </div>
        <div slot="leftpane__action">
            <Button type="submit" form="password-form" classes="w-full" disabled={!password || !confirmedPassword || busy}>
                {locale('actions.savePassword')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-yellow dark:bg-gray-900">
            <Illustration illustration="password-desktop" width="100%" height="auto" />
        </div>
    </OnboardingLayout>
{/if}
