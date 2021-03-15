<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { getBackupWarningColor } from 'shared/lib/helpers'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { updateProfile } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { date } from 'svelte-i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { getDefaultStrongholdName } from 'shared/lib/utils';

    export let locale
    export let lastBackupDate
    export let lastBackupDateFormatted
    export let isStrongholdLocked

    let color = getBackupWarningColor(lastBackupDate)

    function handleBackupClick() {
        if (isStrongholdLocked) {
            openPopup({ type: 'password', props: { onSuccess: triggerBackup } })
        } else {
            triggerBackup()
        }
    }

    function handleCancelClick() {
        closePopup()
    }

    function triggerBackup() {
        Electron.getStrongholdBackupDestination(getDefaultStrongholdName())
            .then((result) => {
                if (result) {
                    api.backup(result, {
                        onSuccess() {
                            updateProfile('lastStrongholdBackupTime', new Date())
                            closePopup()
                        },
                        onError(err) {
                            showAppNotification({
                                type: 'error',
                                message: locale(err.error),
                            })
                        },
                    })
                }
            })
            .catch((error) => console.error(error))
    }
</script>

<style type="text/scss">
    img {
        width: 196px;
    }
</style>

<div class="flex w-full flex-row flex-wrap">
    <Text type="h4" classes="mb-5">
        {lastBackupDate ? locale('popups.backup.title', {
                  values: { date: $date(lastBackupDate, { format: 'long' }) },
              }) : locale('popups.backup.notBackedUp')}
    </Text>
    <div class="w-full p-4 bg-gray-50 flex justify-center content-center"><img src="assets/logos/stronghold.svg" alt="" /></div>
    <div class="w-full text-center my-6 px-8">
        <Text overrideColor type="h5" classes="mb-2 text-{color}-600">
            {#if !lastBackupDate}
                {locale('popups.backup.notBackedUpDescription')}
            {:else}
                {locale('popups.backup.lastBackup', {
                    values: {
                        date: locale(`dates.${lastBackupDateFormatted.unit}`, {
                            values: { time: lastBackupDateFormatted.value },
                        }),
                    },
                })}
            {/if}
        </Text>
        <Text smaller secondary classes="mb-2">{locale('popups.backup.backupDescription')}</Text>
        <Text smaller secondary>{locale('popups.backup.backupWarning')}</Text>
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full px-8 ">
        <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" onClick={() => handleBackupClick()}>{locale('actions.saveBackup')}</Button>
    </div>
</div>
