<script lang="ts">
    import { AnimationEnum } from '@auxiliary/animation'
    import { OnboardingLayout } from '@components'
    import { updateOnboardingProfile, validateBackupFile } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { STRONGHOLD_VERSION } from '@core/stronghold/constants'
    import { Animation, Button, Dropzone, Text } from '@ui'
    import { onMount } from 'svelte'
    import { restoreFromStrongholdRouter } from '@core/router'

    interface FileWithPath extends File {
        path?: string
    }

    const allowedExtensions = ['stronghold']

    let importFileName = ''
    let importFilePath = ''
    let dropping = false

    function onContinueClick(): void {
        validateBackupFile(importFileName)
        updateOnboardingProfile({
            importFilePath,
            // TODO: we don't have a way to know the stronghold version of the backup file yet
            strongholdVersion: STRONGHOLD_VERSION,
        })
        $restoreFromStrongholdRouter.next()
    }

    function onBackClick(): void {
        $restoreFromStrongholdRouter.previous()
    }

    function setFile(file?: FileWithPath): void {
        if (!file) {
            file = null
            importFileName = null
            importFilePath = null
            return
        }

        importFileName = file?.name
        importFilePath = file?.path
    }

    function onFileSelection(event: DragEvent | Event): void {
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

        reader.onload = (): void => {
            setFile(fileWithPath)
        }

        reader.readAsArrayBuffer(fileWithPath)
    }

    onMount(() => {
        updateOnboardingProfile({ importFilePath: undefined })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileRecovery.importStrongholdBackup.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8"
            >{localize('views.onboarding.profileRecovery.importStrongholdBackup.body')}</Text
        >
        <Dropzone
            fileName={importFileName}
            {allowedExtensions}
            onDrop={onFileSelection}
            bind:dropping
            extentionsLabel={localize('actions.importExtentions')}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" disabled={!importFilePath} onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
        <Animation animation={AnimationEnum.ImportFromFileDesktop} />
    </div>
</OnboardingLayout>
