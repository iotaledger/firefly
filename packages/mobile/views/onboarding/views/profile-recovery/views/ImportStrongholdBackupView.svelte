<script lang="typescript">
    import { OnboardingLayout } from '@components'
    import { Button, Text, TextType } from '@ui'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '@/routers'
    import {
        ImportFile,
        setProfileRecoveryTypeFromFilename,
        updateOnboardingProfile,
        validateBackupFile,
    } from '@contexts/onboarding'
    import { onMount } from 'svelte'

    const importFile: ImportFile = null
    let importFileName = ''
    let importFilePath = ''
    const title = localize('views.onboarding.profileRecovery.importStrongholdBackup.title')

    async function onFileSelected() {
        importFilePath = await Platform.getStrongholdBackupDestination(null)
        importFileName = importFilePath.split('/').pop()
        validateBackupFile(importFileName)
        setProfileRecoveryTypeFromFilename(importFileName)
        updateOnboardingProfile({ importFile, importFilePath })
        $profileRecoveryRouter.next()
    }

    function onBackClick(): void {
        $profileRecoveryRouter.previous()
    }

    onMount(() => {
        updateOnboardingProfile({ importFile: null, importFilePath: null, strongholdPassword: null })
    })
</script>

<OnboardingLayout {onBackClick} {title} animation="import-from-file-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary classes="mb-8"
            >{localize('views.onboarding.profileRecovery.importStrongholdBackup.body')}</Text
        >
    </div>
    <div slot="footer" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" onClick={onFileSelected}>
            {localize('actions.chooseFile')}
        </Button>
    </div>
</OnboardingLayout>
