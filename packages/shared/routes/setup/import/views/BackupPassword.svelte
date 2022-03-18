<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { Locale } from 'shared/lib/typings/i18n'
    import { ImportType } from 'shared/lib/typings/profile'
    import { createEventDispatcher, getContext } from 'svelte'
    import { Writable } from 'svelte/store'

    export let locale: Locale

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

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        {#if $mobile}
            <Text type="h2" classes="mb-4">{`${locale('general.import')} ${locale(`general.${$importType}`)}`}</Text>
        {:else}
            <Text type="h2" classes="mb-4">{locale('general.import')}</Text>
            <Text type="h3" highlighted>{locale(`general.${$importType}`)}</Text>
        {/if}
    </div>
    <div slot="leftpane__content">
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
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
