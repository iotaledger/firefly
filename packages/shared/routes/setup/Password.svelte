<script>
    import zxcvbn from 'zxcvbn'
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Password, Illustration, Text, Button } from 'shared/components'
    export let locale
    export let mobile

    let password = ''
    let confirmedPassword = ''

    const dispatch = createEventDispatcher()

    $: strength = zxcvbn(password).score
    $: valid = strength === 4 && password === confirmedPassword

    function handleContinueClick() {
        dispatch('next', { password })
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
            <Text type="h2" classes="mb-5">{locale('views.password.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.password.body')}</Text>
            <Password
                classes="mb-6"
                bind:value={password}
                strengthLevels={4}
                showRevealToggle
                showStrengthLevel
                {strength}
                {locale} />
            <Password bind:value={confirmedPassword} {locale} placeholder={locale('general.confirm_password')} />
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={!valid} onClick={() => handleContinueClick()}>
                {locale('actions.save_password')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration illustration="password-desktop" height="100%" width="auto" classes="h-full object-cover object-left" />
        </div>
    </OnboardingLayout>
{/if}
