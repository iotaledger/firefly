<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Text, Button, Icon, Illustration } from 'shared/components'

    export let locale
    export let mobile
    export let importType

    const dispatch = createEventDispatcher()

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
                <Text type="h2" classes="mb-5 text-center">{locale(`views.importSuccess.${importType}Title`)}</Text>
                <Text type="p" secondary classes="mb-10">{locale(`views.importSuccess.${importType}Body`)}</Text>
            </div>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <!-- TODO: missing illustration -->
        <div slot="rightpane" class="w-full h-full bg-pastel-green dark:bg-gray-900">
            <Illustration illustration={ importType === 'seed' || importType === 'mnemonic' ? 'import-from-text-success-desktop' : 'import-from-file-success-desktop'} width="auto" height="100%" classes="h-full object-scale-down object-right"/>
        </div>
    </OnboardingLayout>
{/if}
