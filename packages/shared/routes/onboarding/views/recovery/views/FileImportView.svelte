<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, Dropzone, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { setImportFile, setProfileRecoveryTypeFromFilename, validateBackupFile } from '@contexts/onboarding'

    interface FileWithPath extends File {
        path?: string
    }

    const allowedExtensions = ['kdbx', 'stronghold']
    const dispatch = createEventDispatcher()

    let file: FileWithPath | ArrayBuffer | string
    let fileName = ''
    let filePath = ''
    let dropping = false

    function handleContinueClick(): void {
        validateBackupFile(fileName)
        setProfileRecoveryTypeFromFilename(fileName)
        setImportFile(<ArrayBuffer>file, filePath)
        dispatch('next')
    }
    function handleBackClick(): void {
        dispatch('previous')
    }

    function setFile(buffer?: string | ArrayBuffer, name?: string, path?: string): void {
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

    function handleFileSelect(event: DragEvent | Event): void {
        event?.preventDefault()
        dropping = false

        const file: FileWithPath =
            (event as DragEvent)?.dataTransfer?.files?.[0] ?? (event?.target as HTMLInputElement)?.files?.[0] ?? null

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

        fileName = file.name

        const reader = new FileReader()

        reader.onload = (e) => {
            setFile(e.target.result, file.name, file.path)
            if ($mobile) {
                handleContinueClick()
            }
        }

        reader.readAsArrayBuffer(file)
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.importFromFile.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.importFromFile.body')}</Text>
        {#if !$mobile}
            <Dropzone
                {fileName}
                {allowedExtensions}
                onDrop={handleFileSelect}
                bind:dropping
                extentionsLabel={localize('actions.importExtentions')}
            />
        {/if}
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        {#if $mobile}
            <input
                class="absolute opacity-0 w-full h-full"
                type="file"
                on:change={handleFileSelect}
                accept={allowedExtensions ? allowedExtensions.map((e) => `.${e}`).join(',') : '*'}
            />
        {/if}
        <Button
            classes="flex-1"
            disabled={!$mobile && !file}
            onClick={$mobile ? handleFileSelect : handleContinueClick}
        >
            {localize(`actions.${$mobile ? 'chooseFile' : 'continue'}`)}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-desktop" />
    </div>
</OnboardingLayout>
