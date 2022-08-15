<script lang="typescript">
    import { Button, Logo, Password, Spinner, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { Platform } from 'shared/lib/platform'
    import { getBackupWarningColor } from 'shared/lib/helpers'
    import { closePopup } from 'shared/lib/popup'
    import { updateProfile } from 'shared/lib/profile'
    import { getDefaultStrongholdName } from 'shared/lib/utils'
    import { api } from 'shared/lib/wallet'
    import { formatDate, Locale } from '@core/i18n'

    export let locale: Locale

    export let lastBackupDate
    export let lastBackupDateFormatted

    const color = getBackupWarningColor(lastBackupDate)
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
            },
        })
    }
</script>

<div class="flex w-full {$mobile ? 'flex-col safe-area' : 'flex-row'} flex-wrap">
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
    <div class="flex flex-row justify-between space-x-4 w-full md:px-8 ">
        <form
            id="password-popup-form"
            class="flex justify-center w-full flex-row flex-wrap"
            on:submit|preventDefault={handleBackupClick}
        >
            <Password
                classes="w-full {$mobile ? 'mb-8' : 'mb-5'}"
                bind:value={password}
                showRevealToggle
                {locale}
                disabled={busy}
                placeholder={locale('general.password')}
                autofocus={!$mobile}
                {error}
            />
            <div class="flex flex-row justify-between w-full space-x-4">
                {#if $mobile}
                    <Button
                        classes="w-full"
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
                {:else}
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
                {/if}
            </div>
        </form>
    </div>
</div>

<style type="text/scss">
    img {
        width: 196px;
    }
    .safe-area {
        margin-bottom: calc(env(safe-area-inset-bottom) / 2);
    }
</style>
