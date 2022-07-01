<script lang="typescript">
    import { Animation, Button, Dropzone, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { recoveryRouter } from '@core/router'
    import {
        ImportFile,
        setImportFile,
        setProfileRecoveryTypeFromFilename,
        validateBackupFile,
    } from '@contexts/onboarding'

    interface FileWithPath extends File {
        path?: string
    }

    const allowedExtensions = ['kdbx', 'stronghold']

    let file: ImportFile
    let fileName = ''
    let filePath = ''
    let dropping = false

    function handleContinueClick(): void {
        validateBackupFile(fileName)
        setProfileRecoveryTypeFromFilename(fileName)
        setImportFile(file, filePath)
        $recoveryRouter.next()
    }

    function handleBackClick(): void {
        $recoveryRouter.previous()
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

        const fileWithPath: FileWithPath =
            (event as DragEvent)?.dataTransfer?.files?.[0] ?? (event?.target as HTMLInputElement)?.files?.[0] ?? null

        if (!fileWithPath) {
            return setFile()
        }

        const ext = /\.([0-9a-z]+)$/i.exec(fileWithPath.name)
        if (!ext || !allowedExtensions.includes(ext[1])) {
            return setFile()
        }

        fileName = fileWithPath.name

        const reader = new FileReader()

        reader.onload = (e) => {
            setFile(e.target.result, fileWithPath.name, fileWithPath.path)
            if ($mobile) {
                handleContinueClick()
            }
        }

        reader.readAsArrayBuffer(fileWithPath)
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
