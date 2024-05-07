<script lang="ts">
    import { localize } from '@core/i18n'
    import { Icon } from '@lib/auxiliary/icon'
    import { MenuItem, Modal } from 'shared/components'
    import { showAppNotification } from '@lib/auxiliary/notification'
    import { setClipboard } from '@lib/core/utils'
    import { activeProfile, getStorageDirectoryOfProfile } from '@lib/core/profile'

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
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        <MenuItem
            icon={Icon.Copy}
            title={localize('actions.copyProfileSystemLocation')}
            onClick={handleCopyProfileSystemLocation}
        />
    </div>
</Modal>
