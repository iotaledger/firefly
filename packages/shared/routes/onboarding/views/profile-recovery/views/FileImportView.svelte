<script lang="typescript">
    import { Animation, Button, Dropzone, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '@core/router'
    import {
        ImportFile,
        setProfileRecoveryTypeFromFilename,
        updateOnboardingProfile,
        validateBackupFile,
    } from '@contexts/onboarding'
    import { onMount } from 'svelte'

    interface FileWithPath extends File {
        path?: string
    }

    const allowedExtensions = ['kdbx', 'stronghold']

    let importFile: ImportFile
    let importFileName = ''
    let importFilePath = ''
    let dropping = false

    function handleContinueClick(): void {
        validateBackupFile(importFileName)
        setProfileRecoveryTypeFromFilename(importFileName)
        updateOnboardingProfile({ importFile, importFilePath })
        $profileRecoveryRouter.next()
    }

    function handleBackClick(): void {
        $profileRecoveryRouter.previous()
    }

    function setFile(buffer?: ImportFile, file?: FileWithPath): void {
        if (!buffer) {
            file = null
            importFileName = null
            importFilePath = null
            return
        }

        importFile = buffer
        importFileName = file?.name
        importFilePath = file?.path
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

        const reader = new FileReader()

        reader.onload = (e) => {
            setFile(e.target.result, fileWithPath)
            if ($mobile) {
                handleContinueClick()
            }
        }

        reader.readAsArrayBuffer(fileWithPath)
    }

    onMount(() => {
        updateOnboardingProfile({ importFile: null, importFilePath: null, strongholdPassword: null })
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.importFromFile.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.importFromFile.body')}</Text>
        {#if !$mobile}
            <Dropzone
                {importFileName}
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
            disabled={!$mobile && !importFile}
            onClick={$mobile ? handleFileSelect : handleContinueClick}
        >
            {localize(`actions.${$mobile ? 'chooseFile' : 'continue'}`)}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-file-desktop" />
    </div>
</OnboardingLayout>
