<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Password, Text, Button, Illustration } from '@shared-components'

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
            <Text type="h1" classes="mb-5">
                {locale('general.import', { values: { type: importType === 'stronghold' ? 'Stronghold' : 'Seedvault' } })}
            </Text>
            <Text type="p" secondary classes="mb-4">{locale('views.import_backup_password.body_1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import_backup_password.body_2')}</Text>
            <Password classes="mb-6" bind:value={password} {locale} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!valid} onClick={() => handleContinue()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="import-from-recovery-phrase-file-desktop" />
        </div>
    </OnboardingLayout>
{/if}
