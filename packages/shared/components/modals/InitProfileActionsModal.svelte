<script lang="ts">
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { initialiseProfileManager } from '@core/profile-manager'
    import { buildProfileManagerOptionsFromProfileData } from '@core/profile-manager/utils'
    import { Icon } from '@lib/auxiliary/icon'
    import { showAppNotification } from '@lib/auxiliary/notification'
    import { activeProfile, getStorageDirectoryOfProfile } from '@lib/core/profile'
    import { setClipboard } from '@lib/core/utils'
    import { MenuItem, Modal } from 'shared/components'
    import { PopupId, openPopup } from '@auxiliary/popup'
    import { profileManager } from '@core/profile-manager/stores'
    import { isLatestStrongholdVersion } from '@core/app'

    export let modal: Modal | undefined

    async function handleCopyProfileSystemLocation(): Promise<void> {
        const profileDirectory = await getStorageDirectoryOfProfile($activeProfile?.id)
        setClipboard(profileDirectory, false)
        showAppNotification({
            type: 'info',
            message: localize('general.copiedToClipboard'),
        })
        modal?.close()
    }

    function openUnlockStrongholdPopup(): void {
        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                onSuccess: () => {
                    openPopup({
                        id: PopupId.GetSeedPopup,
                        props: {
                            readFromFile: false,
                        },
                    })
                },
            },
        })
    }

    async function backupSeed(): Promise<void> {
        if (!isLatestStrongholdVersion($activeProfile?.strongholdVersion)) {
            showAppNotification({
                type: 'error',
                message:
                    'The selected profile needs migration. Please locate your stronghold file and use the drag-and-drop flow located in the Electron menu > Backup Seed.',
            })
            return
        }
        if (!$profileManager) {
            const profileManagerOptions = await buildProfileManagerOptionsFromProfileData($activeProfile)
            const { storagePath, coinType, clientOptions, secretManager: secretManagerType } = profileManagerOptions
            const manager = await initialiseProfileManager(
                storagePath,
                coinType,
                clientOptions,
                secretManagerType,
                $activeProfile?.id
            )
            profileManager.set(manager)
        }
        openUnlockStrongholdPopup()
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Copy}
            title={localize('actions.copyProfileSystemLocation')}
            onClick={handleCopyProfileSystemLocation}
        />
        {#if $activeProfile?.type === ProfileType.Software}
            <MenuItem icon={Icon.Copy} title="Backup seed" onClick={backupSeed} />
        {/if}
    </div>
</Modal>
