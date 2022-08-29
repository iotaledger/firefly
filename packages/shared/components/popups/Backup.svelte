<script lang="typescript">
    import { Button, Logo, Password, Spinner, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { Platform } from 'shared/lib/platform'
    import { getBackupWarningColor } from 'shared/lib/helpers'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { updateProfile } from 'shared/lib/profile'
    import { getDefaultStrongholdName } from 'shared/lib/utils'
    import { api } from 'shared/lib/wallet'
    import { formatDate, Locale } from '@core/i18n'
    import { showAppNotification } from '@lib/notifications'

    export let locale: Locale

    export let lastBackupDate
    export let lastBackupDateFormatted

    const color = getBackupWarningColor(lastBackupDate)
    let password = ''
    let busy = false
    let error = ''
    let exportBusy = false
    let exportMessage = ''

    function handleCancelClick() {
        closePopup()
    }

    function handleBackupClick(callback?: (cancelled: boolean, err?: string) => void | undefined) {
        error = ''
        api.setStrongholdPassword(password, {
            onSuccess() {
                Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
                    .then((result) => {
                        if (result) {
                            busy = true
                            Platform.saveStrongholdBackup({ allowAccess: true })
                            api.backup(result, password, {
                                onSuccess() {
                                    Platform.saveStrongholdBackup({ allowAccess: false })
                                    updateProfile('lastStrongholdBackupTime', new Date())
                                    busy = false
                                    callback(false)
                                    closePopup()
                                },
                                onError(err) {
                                    busy = false
                                    error = locale(err.error)
                                    callback(false, err.error)
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
            },
        })
    }

    function handleExportClick() {
        reset()

        const _callback = (cancelled, err) => {
            setTimeout(
                () => {
                    exportMessage = ''
                },
                cancelled ? 0 : 2000
            )
            exportBusy = false
            if (!cancelled) {
                if (err) {
                    exportMessage = locale('general.exportingStrongholdFailed')
                    showAppNotification({
                        type: 'error',
                        message: locale(err),
                    })
                } else {
                    exportMessage = locale('general.exportingStrongholdSuccess')
                }
            }
        }

        openPopup({
            type: 'password',
            hideClose: true,
            overflow: true,
            props: {
                onSuccess: (_password) => {
                    exportBusy = true
                    exportMessage = locale('general.exportingStronghold')
                    password = _password
                    handleBackupClick(_callback)
                },
                returnPassword: true,
                subtitle: locale('popups.password.backup'),
            },
        })
    }
    function reset() {
        exportBusy = false
        exportMessage = ''
    }
</script>

<div class="flex w-full {$mobile ? 'flex-col' : 'flex-row'} flex-wrap">
    <Text type="h4" classes="{$mobile && 'text-center -mt-4'} mb-5">
        {lastBackupDate
            ? locale('popups.backup.title', {
                  values: { date: formatDate(lastBackupDate, { format: 'long' }) },
              })
            : locale('popups.backup.notBackedUp')}
    </Text>
    <div class="w-full p-4 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
        {#if $mobile}
            <img
                data-label="stronghold-illustration"
                width="100%"
                height="100%"
                src="assets/illustrations/export-stronghold.png"
                alt=""
            />
        {:else}
            <Logo width="50%" logo="logo-stronghold" />
        {/if}
    </div>
    <div class="w-full {$mobile ? 'my-5' : 'text-center my-6'} md:px-8">
        <Text overrideColor={$mobile === false} type="h5" classes="mb-2 text-{color}-600">
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
        {#if $mobile}
            <Text overrideColor classes="mb-2 text-gray-600" lineHeight="6"
                >{locale('popups.backup.backupDescription')}</Text
            >
            <Text overrideColor classes="text-gray-600" lineHeight="6">{locale('popups.backup.backupWarning')}</Text>
        {:else}
            <Text smaller secondary classes="mb-2">{locale('popups.backup.backupDescription')}</Text>
            <Text smaller secondary>{locale('popups.backup.backupWarning')}</Text>
        {/if}
    </div>
    {#if $mobile}
        <Button medium inlineStyle="min-width: 156px;" onClick={handleExportClick} disabled={exportBusy}>
            {locale('actions.export')}
        </Button>
        <Spinner busy={exportBusy} message={exportMessage} classes="ml-2" />
    {:else}
        <div class="flex flex-row justify-between space-x-4 w-full md:px-8 ">
            <form
                id="password-popup-form"
                class="flex justify-center w-full flex-row flex-wrap"
                on:submit|preventDefault={() => handleBackupClick()}
            >
                <Password
                    classes="w-full mb-5}"
                    bind:value={password}
                    showRevealToggle
                    {locale}
                    disabled={busy}
                    placeholder={locale('general.password')}
                    autofocus={false}
                    {error}
                />
                <div class="flex flex-row justify-between w-full space-x-4">
                    <Button secondary classes="w-1/2" onClick={handleCancelClick} disabled={busy}
                        >{locale('actions.cancel')}</Button
                    >
                    <Button
                        classes="w-1/2"
                        type="submit"
                        form="password-popup-form"
                        disabled={!password || password.length === 0 || busy}
                    >
                        {#if busy}
                            <Spinner busy={true} message={locale('popups.backup.saving')} classes="justify-center" />
                        {:else}
                            {locale('actions.saveBackup')}
                        {/if}
                    </Button>
                </div>
            </form>
        </div>
    {/if}
</div>

<style type="text/scss">
    img {
        width: 196px;
    }
</style>
