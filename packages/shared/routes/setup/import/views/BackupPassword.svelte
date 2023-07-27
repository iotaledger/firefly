<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text } from 'shared/components'
    import { mobile, strongholdPassword } from 'shared/lib/app'
    import { Locale } from '@core/i18n'
    import { createEventDispatcher, getContext } from 'svelte'
    import { ImportRouter } from '@core/router'

    export let locale: Locale

    export let error = ''
    export let busy = false

    const { importType, isGettingMigrationData } = getContext<ImportRouter>('importRouter')

    let password = ''
    $: password, (error = '')

    const dispatch = createEventDispatcher()

    function handleContinue(): void {
        if (password) {
            strongholdPassword.set(password)
            dispatch('next', { password })
        }
    }

    function handleBackClick(): void {
        if (!busy && !$isGettingMigrationData) {
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
            disabled={password.length === 0 || busy || $isGettingMigrationData}
            onClick={() => handleContinue()}
        >
            {#if busy || $isGettingMigrationData}
                <Spinner busy message={locale('views.migrate.restoringWallet')} classes="justify-center" />
            {:else}
                {locale('actions.continue')}
            {/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
