<script lang="typescript">
    import { Button, Logo, Password, Spinner, Text } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { getBackupWarningColor } from 'shared/lib/helpers'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { updateProfile } from 'shared/lib/profile'
    import { getDefaultStrongholdName } from 'shared/lib/utils'
    import { api } from 'shared/lib/wallet'
    import { formatDate } from 'shared/lib/i18n'

    export let locale
    export let lastBackupDate
    export let lastBackupDateFormatted

    let color = getBackupWarningColor(lastBackupDate)
    let password = ''
    let busy = false
    let error = ''

    function handleCancelClick() {
        closePopup()
    }

    function handleBackupClick() {
        error = ''
        api.setStrongholdPassword(password, {
            onSuccess() {
                Electron.getStrongholdBackupDestination(getDefaultStrongholdName())
                    .then((result) => {
                        if (result) {
                            busy = true
                            api.backup(result, password, {
                                onSuccess() {
                                    updateProfile('lastStrongholdBackupTime', new Date())
                                    busy = false
                                    closePopup()
                                },
                                onError(err) {
                                    busy = false
                                    error = locale(err.error)
                                },
                            })
                        } else {
                            busy = false
                        }
                    })
                    .catch((error) => {
                        busy = false
                        console.error(error)
                    })
            },
            onError(err) {
                busy = false
                error = locale(err.error)
            }
        })
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
                  values: { date: formatDate(lastBackupDate, { format: 'long' }) },
              }) : locale('popups.backup.notBackedUp')}
    </Text>
    <div class="w-full p-4 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
        <Logo width="50%" logo="logo-stronghold" />
    </div>
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
        <form id="password-popup-form" class="flex justify-center w-full flex-row flex-wrap" on:submit={handleBackupClick}>
            <Password
                classes="w-full mb-5"
                bind:value={password}
                showRevealToggle
                {locale}
                disabled={busy}
                placeholder={locale('general.password')}
                autofocus 
                error={error} />
            <div class="flex flex-row justify-between w-full space-x-4 px-8">
                <Button secondary classes="w-1/2" onClick={handleCancelClick} disabled={busy}>{locale('actions.cancel')}</Button>
                <Button classes="w-1/2" type="submit" form="password-popup-form" disabled={!password || password.length === 0 || busy}>
                    {#if busy}
                        <Spinner busy={true} message={locale('popups.backup.saving')} classes="justify-center" />
                    {:else}
                        {locale('actions.saveBackup')}
                    {/if}
                </Button>
            </div>
        </form>
    </div>
</div>
