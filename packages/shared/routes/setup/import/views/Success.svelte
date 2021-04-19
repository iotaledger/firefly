<script lang="typescript">
    import { Button, Icon, Illustration, OnboardingLayout, Text } from 'shared/components'
    import { createEventDispatcher, getContext } from 'svelte'
    import type { Writable } from 'svelte/store'
    import { ImportType } from '../Import.svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()
    const importType = getContext<Writable<ImportType>>('importType')

    function handleContinueClick() {
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
            <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5">
                <div class="bg-green-100 rounded-2xl relative -top-10">
                    <Icon icon="success-check" classes="text-white" />
                </div>
                <Text type="h2" classes="mb-5 text-center">{locale(`views.importSuccess.title`)}</Text>
                <Text type="p" secondary classes="mb-2">{locale(`views.importSuccess.body`)}</Text>
            </div>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <!-- TODO: missing illustration -->
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-green dark:bg-gray-900">
            <Illustration
                illustration={$importType === ImportType.Seed || $importType === ImportType.Mnemonic ? 'import-from-text-success-desktop' : 'import-from-file-success-desktop'}
                width="100%"
                height="auto" />
        </div>
    </OnboardingLayout>
{/if}
