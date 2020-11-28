<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Dropzone, Button } from 'shared/components'

    export let locale
    export let mobile
    let file
    let fileName

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next', { file, fileName })
    }
    function handleBackClick() {
        dispatch('previous')
    }

    // TODO error management
    const onDrop = (buffer, name) => {
        if (!buffer) {
            file = null
            fileName = null
            return
        }
        file = buffer
        fileName = name
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.import_from_file.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.import_from_file.body')}</Text>
            <Dropzone
                {onDrop}
                {locale}
                extentionsLabel={locale('actions.import_extentions')}
                allowedExtensions=".kdbx,.stronghold" />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center gap-4">
            <Button secondary classes="flex-auto" onClick={() => handleBackClick()}>{locale('actions.back')}</Button>
            <Button classes="flex-auto" disabled={!file} onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            <Illustration width="100%" illustration="import-from-file-desktop" />
        </div>
    </OnboardingLayout>
{/if}
