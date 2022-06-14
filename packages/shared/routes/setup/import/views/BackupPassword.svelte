<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Password, Spinner, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { createEventDispatcher, getContext } from 'svelte'
    import { ImportRouter } from '@core/router'

    export let error = ''
    export let busy = false

    const { importType, isGettingMigrationData } = getContext<ImportRouter>('importRouter')

    let password = ''

    const dispatch = createEventDispatcher()

    function handleContinue(): void {
        if (password) {
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
            <Text type="h2" classes="mb-4">
                {`${localize('general.import')} ${localize(`general.${$importType}`)}`}
            </Text>
        {:else}
            <Text type="h2" classes="mb-4">{localize('general.import')}</Text>
            <Text type="h3" highlighted>{localize(`general.${$importType}`)}</Text>
        {/if}
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.importBackupPassword.body1')}</Text>
        <Text type="p" secondary classes="mb-8">{localize('views.importBackupPassword.body2')}</Text>
        <Password
            classes="mb-6"
            {error}
            bind:value={password}
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
            {#if $isGettingMigrationData}
                <Spinner
                    busy={$isGettingMigrationData}
                    message={localize('views.migrate.restoringWallet')}
                    classes="justify-center"
                />
            {:else}{localize('actions.continue')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-orange dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-password-desktop" />
    </div>
</OnboardingLayout>
