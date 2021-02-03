<script>
    import { getContext } from 'svelte'
    import { date } from 'svelte-i18n'
    import { Text, Button } from 'shared/components'
    import { getBackupWarningColor } from 'shared/lib/helpers'
    import { api } from 'shared/lib/wallet'
    import { updateStrongholdBackupTime } from 'shared/lib/app'

    export let locale
    export let lastBackupDate
    export let lastBackupDateFormatted
    export let isStrongholdLocked

    let color = getBackupWarningColor(lastBackupDate)

    const popupState = getContext('popupState')

    function handleBackupClick() {
        if (isStrongholdLocked) {
            popupState.set({ active: false })
            popupState.set({ active: true, type: 'password', props: { onSuccess: triggerBackup } })
        } else {
            triggerBackup()

        }
    }

    function handleCancelClick() {
        popupState.set({ active: false })
    }

    function triggerBackup() {

        window['Electron']
            .getStrongholdBackupDestination()
            .then((result) => {
                if (result) {
                    api.backup(result, {
                        onSuccess() {
                            updateStrongholdBackupTime(new Date())
                            popupState.set({ active: false })
                        },
                        onError(error) {
                            console.error(error)
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
        {locale('popups.backup.title', { values: { date: $date(lastBackupDate.lastBackupDate, { format: 'long' }) } })}
    </Text>
    <div class="w-full p-4 bg-gray-50 flex justify-center content-center"><img src="assets/logos/stronghold.svg" alt="" /></div>
    <div class="w-full text-center my-6 px-8">
        <Text overrideColor type="h5" classes="mb-2 text-{color}-600">
            {#if !lastBackupDate}
                {locale('popups.backup.not_backed_up_description')}
            {:else}
                {locale('popups.backup.last_backup', {
                    values: {
                        date: locale(`dates.${lastBackupDateFormatted.unit}`, {
                            values: { time: lastBackupDateFormatted.value },
                        }),
                    },
                })}
            {/if}
        </Text>
        <Text smaller secondary classes="mb-2">{locale('popups.backup.backup_description')}</Text>
        <Text smaller secondary>{locale('popups.backup.backup_warning')}</Text>
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full px-8 ">
        <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" onClick={() => handleBackupClick()}>{locale('actions.save_backup')}</Button>
    </div>
</div>
