<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text } from 'shared/components'
    import { createEventDispatcher, getContext } from 'svelte'
    import type { Writable } from 'svelte/store'
    import type { ImportType } from '../Import.svelte'

    export let locale
    export let mobile
    export let error = ''
    export let busy = false

    export let isGettingMigrationData
    const importType = getContext<Writable<ImportType>>('importType')

    let password = ''

    const dispatch = createEventDispatcher()

    function handleContinue() {
        if (password) {
            dispatch('next', { password })
        }
    }
    function handleBackClick() {
        if (!busy && !isGettingMigrationData) {
            dispatch('previous')
        }
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-4">{locale('general.import')}</Text>
            <Text type="h3" highlighted classes="mb-5">{locale(`general.${$importType}`)}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.importBackupPassword.body1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importBackupPassword.body2')}</Text>
            <Password
                classes="mb-6"
                {error}
                bind:value={password}
                {locale}
                showRevealToggle
                autofocus
                disabled={busy}
                submitHandler={handleContinue}
            />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button
                classes="flex-1"
                disabled={password.length === 0 || busy || isGettingMigrationData}
                onClick={() => handleContinue()}
            >
                {#if isGettingMigrationData}
                    <Spinner
                        busy={isGettingMigrationData}
                        message={locale('views.migrate.restoringWallet')}
                        classes="justify-center"
                    />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Animation animation="import-from-file-password-desktop" />
        </div>
    </OnboardingLayout>
{/if}
