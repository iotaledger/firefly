<script lang="typescript">
    import { Animation, Button, Dropzone, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { createEventDispatcher } from 'svelte'
    import { Platform } from 'shared/lib/platform'
    import { Locale } from '@core/i18n'

    export let locale: Locale
    export let busy = false

    let file
    let fileName: string | null
    let filePath: string
    let dropping: boolean

    const handleFileSelectMobile = async () => {
        filePath = await Platform.getStrongholdBackupDestination(null)
        fileName = filePath.split('/').pop()
    }

    const allowedExtensions = $mobile ? ['stronghold'] : ['kdbx', 'stronghold', 'txt']

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next', { file, fileName, filePath })
    }
    function handleBackClick() {
        dispatch('previous')
    }

    const setFile = (buffer?, name?, path?) => {
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

    const handleFileSelect = (e) => {
        e?.preventDefault()
        dropping = false

        const file = e?.dataTransfer?.files?.[0] ?? e?.target?.files?.[0] ?? null

        if (!file) {
            fileName = null
            return setFile()
        }

        if (allowedExtensions && allowedExtensions.length > 0) {
            const ext = /\.([0-9a-z]+)$/i.exec(file.name)
            if (!ext || !allowedExtensions.includes(ext[1])) {
                fileName = null
                return setFile()
            }
        }

        const reader = new FileReader()

        reader.onload = (e) => {
            setFile(e.target.result, file.name, file.path)
        }

        reader.readAsArrayBuffer(file)
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.importFromFile.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{locale('views.importFromFile.body')}</Text>
        <Dropzone
            {locale}
            {fileName}
            {allowedExtensions}
            onDrop={$mobile ? handleFileSelectMobile : handleFileSelect}
            bind:dropping
            extensionsLabel={locale('actions.importExtentions')}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" disabled={!fileName || busy} onClick={handleContinueClick}>
            {#if busy}
                <Spinner busy message={locale('actions.importing')} classes="justify-center" />
            {:else}
                {locale('actions.continue')}
            {/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-desktop" />
    </div>
</OnboardingLayout>
