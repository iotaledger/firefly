<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { createEventDispatcher } from 'svelte'
    import { Locale } from '@core/i18n'

    export let locale: Locale
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

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{locale('views.backupWallet.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <form on:submit|preventDefault={onSubmit} id="backup-form">
            <Text type="p" secondary classes="mb-8">{locale('views.backupWallet.body1')}</Text>
            <Password
                bind:value={confirmPassword}
                {locale}
                autofocus={!$mobile}
                disabled={busy}
                showRevealToggle
                classes="mb-8"
            />
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
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation="backup-recovery-phrase-desktop"
        />
    </div>
</OnboardingLayout>
