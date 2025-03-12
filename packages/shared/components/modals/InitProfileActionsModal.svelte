<script lang="ts">
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { api, initialiseProfileManager } from '@core/profile-manager'
    import { buildProfileManagerOptionsFromProfileData } from '@core/profile-manager/utils'
    import { Icon } from '@lib/auxiliary/icon'
    import { showAppNotification } from '@lib/auxiliary/notification'
    import { activeProfile, getStorageDirectoryOfProfile } from '@lib/core/profile'
    import { setClipboard } from '@lib/core/utils'
    import { MenuItem, Modal } from 'shared/components'

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

    async function backupSeed(): Promise<void> {
        const profileManagerOptions = await buildProfileManagerOptionsFromProfileData($activeProfile)
        const { storagePath, coinType, clientOptions, secretManager: secretManagerType } = profileManagerOptions
        const manager = await initialiseProfileManager(
            storagePath,
            coinType,
            clientOptions,
            secretManagerType,
            $activeProfile?.id
        )
        await manager.clearStrongholdPassword()
        await manager.setStrongholdPassword('passwordhere')
        const secretManager = await api.getSecretManager(manager.id)
        const seed = await secretManager?.getSeed()
        console.log('seed', seed)
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
