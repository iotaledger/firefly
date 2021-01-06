<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Password, Text, Button, Illustration } from 'shared/components'

    export let locale
    export let mobile
    export let importType

    let password = ''

    const dispatch = createEventDispatcher()

    // dummy
    $: valid = password.length > 8

    function handleContinue() {
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
            <Text type="h2" classes="mb-4">{locale('general.import')}</Text>
            <Text type="h3" highlighted classes="mb-5">{locale(`general.${importType}`)}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.import_backup_password.body_1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import_backup_password.body_2')}</Text>
            <Password classes="mb-6" bind:value={password} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center gap-4">
            <Button secondary classes="flex-auto" onClick={() => handleBackClick()}>{locale('actions.back')}</Button>
            <Button classes="flex-auto" disabled={!valid} onClick={() => handleContinue()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration width="100%" illustration="import-from-file-password-desktop" />
        </div>
    </OnboardingLayout>
{/if}
