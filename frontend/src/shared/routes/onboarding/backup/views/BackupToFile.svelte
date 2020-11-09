<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Password, Illustration, Text, Button } from '@shared-components'

    export let locale
    export let mobile
    export let strongholdPassword

    let confirmPassword

    const dispatch = createEventDispatcher()

    $: valid = strongholdPassword === confirmPassword

    function handleContinueClick() {
        dispatch('next')
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
            <Text type="h1" classes="mb-5">{locale('views.backup-recovery-phrase.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.backup-recovery-phrase.body')}</Text>
            <Password bind:value={confirmPassword} placeholder={locale('general.confirm_password')} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!valid} onClick={() => handleContinueClick()}>{locale('actions.save_password')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="backup-recovery-phrase-desktop" />
        </div>
    </OnboardingLayout>
{/if}
