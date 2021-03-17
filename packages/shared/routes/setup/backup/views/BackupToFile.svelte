<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Password, Illustration, Text, Button } from 'shared/components'

    export let locale
    export let mobile
    export let strongholdPassword

    let confirmPassword

    const dispatch = createEventDispatcher()

    $: valid = strongholdPassword === confirmPassword

    function onSubmit() {
        if (valid) {
            dispatch('next')
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
            <form on:submit={onSubmit} id="backup-form">
                <Text type="h2" classes="mb-5">{locale('views.backupWallet.title')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.backupWallet.body')}</Text>
                <Password bind:value={confirmPassword} {locale} autofocus />
            </form>
        </div>
        <div slot="leftpane__action">
            <Button type="submit" form="backup-form" classes="w-full" disabled={!valid}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration width="100%" illustration="backup-recovery-phrase-desktop" />
        </div>
    </OnboardingLayout>
{/if}
