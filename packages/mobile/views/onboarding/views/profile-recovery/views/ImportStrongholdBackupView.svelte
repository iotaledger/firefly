<script lang="typescript">
    import { OnboardingLayout } from '@components'
    import { Button, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '@/routers'
    import {
        ImportFile,
        setProfileRecoveryTypeFromFilename,
        updateOnboardingProfile,
        validateBackupFile,
    } from '@contexts/onboarding'
    import { onMount } from 'svelte'

    // TODO: Not needed for native mobile
    let fakeSelectionInput: HTMLElement

    let importFile: ImportFile = null
    let importFileName = ''
    let importFilePath = ''
    const title = localize('views.onboarding.profileRecovery.importStrongholdBackup.title')

    function onChooseFile(): void {
        // TODO: implement share functionality here for native mobile
        fakeSelectionInput.click()
    }

    function onFileSelected() {
        validateBackupFile(importFileName)
        setProfileRecoveryTypeFromFilename(importFileName)
        updateOnboardingProfile({ importFile, importFilePath })
        $profileRecoveryRouter.next()
    }

    function onBackClick(): void {
        $profileRecoveryRouter.previous()
    }

    // TODO: Remove fake selection for native mobile
    function fakeSelection(event): void {
        const fileWithPath = event.target.files[0]
        const ext = /\.([0-9a-z]+)$/i.exec(fileWithPath.name)
        if (!ext || !['stronghold'].includes(ext[1])) {
            return
        }
        const reader = new FileReader()
        reader.onload = (e): void => {
            importFile = e.target.result
            importFileName = fileWithPath?.name
            importFilePath = fileWithPath?.path
            onFileSelected()
        }
        reader.readAsArrayBuffer(fileWithPath)
    }

    onMount(() => {
        updateOnboardingProfile({ importFile: null, importFilePath: null, strongholdPassword: null })
    })
</script>

<!-- TODO: Not needed for native mobile -->
<input bind:this={fakeSelectionInput} type="file" class="hidden" on:change={fakeSelection} />

<OnboardingLayout {onBackClick} {title} animation="import-from-file-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary classes="mb-8"
            >{localize('views.onboarding.profileRecovery.importStrongholdBackup.body')}</Text
        >
    </div>
    <div slot="footer" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" onClick={onChooseFile}>
            {localize('actions.chooseFile')}
        </Button>
    </div>
</OnboardingLayout>
