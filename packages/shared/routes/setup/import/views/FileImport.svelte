<script lang="typescript">
    import { Animation, Button, Dropzone, OnboardingLayout, Text } from 'shared/components'
    import { checkChrysalisSnapshot, ongoingSnapshot } from 'shared/lib/migration'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile
    let file
    let fileName
    let filePath

    let snapshotBusy = false

    const dispatch = createEventDispatcher()

    async function handleContinueClick() {
        const seedvaultRegex = /\.(kdbx)$/i
        if (seedvaultRegex.test(fileName)) {
            // Migration: snapshot check
            snapshotBusy = true
            await checkChrysalisSnapshot()
            //
            if (get(ongoingSnapshot) === false) {
                dispatch('next', { file, fileName, filePath })
            }
            snapshotBusy = false
        } else {
            dispatch('next', { file, fileName, filePath })
        }
    }
    function handleBackClick() {
        dispatch('previous')
    }

    const onDrop = (buffer, name, path) => {
        if (!buffer) {
            file = null
            fileName = null
            filePath = null
            return
        }

        file = buffer
        fileName = name
        filePath = path
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.importFromFile.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.importFromFile.body')}</Text>
            <Dropzone
                {onDrop}
                {locale}
                extentionsLabel={locale('actions.importExtentions')}
                allowedExtensions={['kdbx', 'stronghold']} />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button classes="flex-1" disabled={!file || snapshotBusy} onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Animation animation="import-from-file-desktop" />
        </div>
    </OnboardingLayout>
{/if}
