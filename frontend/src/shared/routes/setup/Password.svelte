<script>
    import zxcvbn from 'zxcvbn'
    import { OnboardingLayout, Password, Illustration, Text, Button } from '@shared-components'
    export let locale
    export let mobile
    export let goto

    let password = ''
    let confirmPassword
    let valid = false

    $: strength = zxcvbn(password).score
    $: passwordMatch = password === confirmPassword
    $: valid = strength === 4 && passwordMatch
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.setup_password.title')}</Text>
            <Text type="p" secondary={true} classes="mb-8">{locale('views.setup_password.body')}</Text>
            <Password
                classes="mb-6"
                bind:value={password}
                strengthLevels={4}
                showRevealToggle={true}
                showStrengthLevel={true}
                {strength}
                {locale} />
            <Password bind:value={confirmPassword} confirmType={true} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!valid} onClick={() => goto('legal')}>{locale('actions.save_password')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16 bg-white">
            <Illustration width="100%" illustration="setup" />
        </div>
    </OnboardingLayout>
{/if}
