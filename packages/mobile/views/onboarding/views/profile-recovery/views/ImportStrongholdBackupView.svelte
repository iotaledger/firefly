<script lang="typescript">
    import { Button, Text, TextType } from 'shared/components'
    import { OnboardingLayout } from '../../../../../components'
    import { CapacitorApi } from '../../../../../capacitor/capacitorApi'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileRecoveryRouter } from '../../../../../lib/routers'
    import {
        ImportFile,
        setProfileRecoveryTypeFromFilename,
        updateOnboardingProfile,
        validateBackupFile,
    } from '@contexts/onboarding'
    import { onMount } from 'svelte'

    let importFile: ImportFile
    let importFileName = ''
    let importFilePath = ''
    let title = localize('views.onboarding.profileRecovery.importStrongholdBackup.title')

    async function onContinueClick(): Promise<void> {
        importFilePath = await CapacitorApi.getStrongholdBackupDestination(null)
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
        <Text type={TextType.p} secondary classes="mb-8">
            {localize('views.onboarding.profileRecovery.importStrongholdBackup.body')}
        </Text>
    </div>
    <div slot="footer" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button
            classes="flex-1"
            disabled={!$mobile && !importFile}
            onClick={onContinueClick}
        >
            {localize(`actions.${$mobile ? 'chooseFile' : 'continue'}`)}
        </Button>
    </div>
</OnboardingLayout>
