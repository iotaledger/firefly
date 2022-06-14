<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { createEventDispatcher, getContext } from 'svelte'
    import { localize } from '@core/i18n'
    import { ProfileImportType } from '@core/profile'
    import { ImportRouter } from '@core/router'

    const dispatch = createEventDispatcher()
    const { importType } = getContext<ImportRouter>('importRouter')

    function handleContinueClick(): void {
        dispatch('next')
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="leftpane__content">
        <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
            <div class="bg-green-500 rounded-2xl relative -top-10">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type="h2" classes="mb-5 text-center">{localize('views.importSuccess.title')}</Text>
            <Text type="p" secondary classes="mb-2">{localize('views.importSuccess.body')}</Text>
        </div>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={() => handleContinueClick()}>{localize('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation
            classes="setup-anim-aspect-ratio"
            animation={$importType === ProfileImportType.Seed || $importType === ProfileImportType.Mnemonic
                ? 'import-from-text-success-desktop'
                : 'import-from-file-success-desktop'}
        />
    </div>
</OnboardingLayout>
