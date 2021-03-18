<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Password, Text, Button, Illustration } from 'shared/components'

    export let locale
    export let mobile
    export let importType
    export let error = ''
    export let busy = false

    let password = ''

    const dispatch = createEventDispatcher()

    function handleContinue() {
        dispatch('next', { password })
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
            <Text type="h2" classes="mb-4">{locale('general.import')}</Text>
            <Text type="h3" highlighted classes="mb-5">{locale(`general.${importType}`)}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.importBackupPassword.body1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importBackupPassword.body2')}</Text>
            <Password classes="mb-6" {error} bind:value={password} {locale} showRevealToggle autofocus disabled={busy} />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button classes="flex-1" disabled={password.length === 0 || busy} onClick={() => handleContinue()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16" style="background-color: #FFF8EF">
            <Illustration illustration="import-from-file-password-desktop" width="auto" height="auto" />
        </div>
    </OnboardingLayout>
{/if}
