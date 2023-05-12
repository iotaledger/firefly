<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { createEventDispatcher, getContext } from 'svelte'
    import { Locale } from '@core/i18n'
    import { ImportType } from 'shared/lib/typings/profile'
    import { ImportRouter } from '@core/router'

    export let locale: Locale

    const dispatch = createEventDispatcher()
    const { importType } = getContext<ImportRouter>('importRouter')

    function handleContinueClick(): void {
        dispatch('next')
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type="h2">{locale('views.importFromFile.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
            <div class="bg-green-500 rounded-2xl relative -top-10">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type="h2" classes="mb-5 text-center">{locale('views.importSuccess.title')}</Text>
            <Text type="p" secondary classes="mb-2">{locale('views.importSuccess.body')}</Text>
        </div>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-green dark:bg-gray-900'}">
        <Animation
            classes="setup-anim-aspect-ratio"
            animation={$importType === ImportType.Seed || $importType === ImportType.Mnemonic
                ? 'import-from-text-success-desktop'
                : 'import-from-file-success-desktop'}
        />
    </div>
</OnboardingLayout>
