<script lang="ts">
    import { localize } from '@core/i18n'
    import { Button, Logo, Text, TextType, KeyValueBox, TextHint, Dropzone } from 'shared/components'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { Logo as LogoEnum, TextHintVariant } from 'shared/components/enums'
    import { setClipboard } from '@core/utils'
    import {
        ImportFile,
        updateOnboardingProfile,
        validateBackupFile,
        initialiseOnboardingProfile,
        initialiseProfileManagerFromOnboardingProfile,
        restoreBackupFromStrongholdFile,
    } from '@contexts/onboarding'
    import { STRONGHOLD_VERSION } from '@core/stronghold'
    import { api, getProfileManager } from '@core/profile-manager'
    import { ProfileType } from '@core/profile'
    import { getDefaultPersistedNetwork, NetworkId } from '@core/network'

    interface FileWithPath extends File {
        path?: string
    }

    export let password: string
    export let readFromFile: boolean
    const allowedExtensions = ['stronghold']

    let seed: string
    let importFile: ImportFile
    let importFileName = ''
    let importFilePath = ''
    let dropping = false
    const title = seed ? 'Backup your seed' : localize('views.onboarding.profileRecovery.importStrongholdBackup.title')

    function onCancelClick(): void {
        closePopup()
    }
    function onCopyClick(): void {
        setClipboard(seed)
    }

    function openUnlockStrongholdPopup(): void {
        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                returnPassword: true,
                onSuccess: (password) => {
                    openPopup({
                        id: PopupId.GetSeedPopup,
                        props: {
                            password,
                        },
                    })
                },
                onCancelled: () => {},
            },
        })
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

        reader.onload = (e): void => {
            setFile(e.target.result, fileWithPath)
        }

        reader.readAsArrayBuffer(fileWithPath)
        reader.onloadend = (): void => {
            extractSeedFromStrongholdFile()
        }
    }

    async function extractSeedFromStrongholdFile(): Promise<void> {
        await initialiseOnboardingProfile(false, true)
        validateBackupFile(importFileName)
        updateOnboardingProfile({
            network: getDefaultPersistedNetwork(NetworkId.Iota),
            importFile,
            importFilePath,
            // TODO: we don't have a way to know the stronghold version of the backup file yet
            strongholdVersion: STRONGHOLD_VERSION,
            type: ProfileType.Software,
        })
        await initialiseProfileManagerFromOnboardingProfile()
        openUnlockStrongholdPopup()
    }

    async function getSeedFromSecretManager(): Promise<void> {
        if (password) {
            await restoreBackupFromStrongholdFile(password)
        }
        const managerId = await getProfileManager().id
        const secretManager = await api.getSecretManager(managerId)
        seed = await secretManager?.getSeed()
    }

    if (!readFromFile) {
        getSeedFromSecretManager()
    }
</script>

<div class="flex w-full flex-col space-y-6">
    <Text type="h2">{title}</Text>
    <div class="w-full p-10 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
        <Logo width="50%" logo={LogoEnum.Stronghold} />
    </div>
    {#if seed}
        <div class="flex flex-col space-y-4">
            <div class="w-full space-y-3">
                <Text type={TextType.p} color="gray-700">
                    If you have lost your mnemonic it is important to back up your seed be able to access your funds. If you lose your mnemonic and seed you will lose access to your funds.
                </Text>
                <TextHint
                    variant={TextHintVariant.Warning}
                    text="You can import this seed into the new IOTA rebased wallet to access your funds."
                />
                <KeyValueBox keyText="Seed" valueText={seed} isCopyable />
            </div>
        </div>
        <div class="flex flex-row justify-between space-x-4 w-full">
            <Button outline classes="w-1/2" onClick={onCancelClick}>
                {localize('actions.cancel')}
            </Button>
            <Button classes="w-1/2" onClick={onCopyClick}>
                {localize('actions.copy')}
            </Button>
        </div>
    {:else}
        <div class="flex flex-col space-y-4">
            <Text type="p" secondary>Import a Stronghold backup file to extract the seed.</Text>
            <Dropzone
                fileName={importFileName}
                {allowedExtensions}
                onDrop={onFileSelection}
                bind:dropping
                extentionsLabel={localize('actions.importExtentions')}
            />
        </div>
    {/if}
</div>
