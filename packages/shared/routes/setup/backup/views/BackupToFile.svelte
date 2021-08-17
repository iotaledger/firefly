<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile
    export let strongholdPassword
    export let busy = false

    let confirmPassword
    let skipping = false

    const dispatch = createEventDispatcher()

    $: valid = strongholdPassword === confirmPassword

    function onSubmit() {
        if (valid) {
            skipping = false
            dispatch('next')
        }
    }
    function handleBackClick() {
        dispatch('previous')
    }
    function handleSkipBackup() {
        skipping = true
        dispatch('next', { skip: true })
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <form on:submit={onSubmit} id="backup-form">
                <Text type="h2" classes="mb-5">{locale('views.backupWallet.title')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.backupWallet.body1')}</Text>
                <Password
                    bind:value={confirmPassword}
                    {locale}
                    autofocus
                    disabled={busy}
                    showRevealToggle
                    classes="mb-8" />
                <Text type="p" secondary classes="mb-4">{locale('views.backupWallet.body2')}</Text>
                <Text type="p" secondary smaller classes="mb-2">- {locale('views.backupWallet.reason1')}</Text>
                <Text type="p" secondary smaller classes="mb-2">- {locale('views.backupWallet.reason2')}</Text>
                <Text type="p" secondary smaller classes="mb-2">- {locale('views.backupWallet.reason3')}</Text>
            </form>
        </div>
        <div slot="leftpane__action">
            <Button secondary classes="w-full mb-4" disabled={busy} onClick={handleSkipBackup}>
                {#if skipping && busy}
                    <Spinner busy={true} message={locale('general.creatingProfile')} classes="justify-center" />
                {:else}{locale('actions.skipBackup')}{/if}
            </Button>
            <Button type="submit" form="backup-form" classes="w-full" disabled={!valid || busy}>
                {#if !skipping && busy}
                    <Spinner busy={true} message={locale('general.creatingProfile')} classes="justify-center" />
                {:else}{locale('actions.saveBackup')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Animation animation="backup-recovery-phrase-desktop" />
        </div>
    </OnboardingLayout>
{/if}
