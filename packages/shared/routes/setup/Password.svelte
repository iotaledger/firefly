<script lang="typescript">
    import zxcvbn from 'zxcvbn'
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Password, Illustration, Text, Button } from 'shared/components'
    import { api } from 'shared/lib/wallet'
    import passwordInfo from 'shared/lib/password';

    export let locale
    export let mobile

    let password = ''
    let confirmedPassword = ''
    let error = ''

    const dispatch = createEventDispatcher()

    // TODO: move to config file
    const MAX_PASSWORD_LENGTH = 256
    $: passwordStrength = zxcvbn(password)

    function handleContinueClick() {
        if (password.length > MAX_PASSWORD_LENGTH) {
            error = locale('error.password.length', { 
                values: {
                    length: MAX_PASSWORD_LENGTH
                }
            })
        } else if (password !== confirmedPassword) {
            error = locale('error.password.doNotMatch')
        } else if (passwordStrength.score !== 4) {
            error = passwordStrength.feedback.warning
                ? locale(`error.password.${passwordInfo[passwordStrength.feedback.warning]}`)
                : locale('error.password.tooWeak');
        } else {
            api.setStrongholdPassword(password, {
                onSuccess() {
                    dispatch('next', { password })
                },
                onError(error) {
                    // TODO: handle error
                    console.log(error)
                },
            })
        }
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <form on:submit={handleContinueClick} id="password-form">
                <Text type="h2" classes="mb-5">{locale('views.password.title')}</Text>
                <Text type="p" secondary classes="mb-3">{locale('views.password.body')}</Text>
                <Password
                    {error}
                    classes="mb-1"
                    bind:value={password}
                    strengthLevels={4}
                    showRevealToggle
                    showStrengthLevel
                    strength={passwordStrength.score}
                    {locale} 
                />
                <Password 
                    bind:value={confirmedPassword} 
                    {locale} 
                    placeholder={locale('general.confirm_password')} 
                    showRevealToggle
                />
            </form>
        </div>
        <div slot="leftpane__action">
            <Button type="submit" form="password-form" classes="w-full" disabled={!password || !confirmedPassword}>
                {locale('actions.save_password')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="password-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
