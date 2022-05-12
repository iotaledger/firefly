<script lang="typescript">
    import { Button, Logo, Password, Spinner, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { getBackupWarningColor } from 'shared/lib/helpers'
    import { closePopup } from 'shared/lib/popup'
    import { getDefaultStrongholdName } from 'shared/lib/utils'
    import { backup, setStrongholdPassword } from 'shared/lib/wallet'
    import { formatDate, Locale } from '@core/i18n'
    import { updateActiveProfile } from '@core/profile'

    export let locale: Locale

    export let lastBackupDate
    export let lastBackupDateFormatted

    const color = getBackupWarningColor(lastBackupDate)
    let password = ''
    let busy = false
    let error = ''

    function handleCancelClick(): void {
        closePopup()
    }

    async function handleBackupClick(): Promise<void> {
        error = ''
        try {
            await setStrongholdPassword(password)
            const destination = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())

            if (destination) {
                busy = true
                await backup(destination, password)
                updateActiveProfile({ lastStrongholdBackupTime: new Date() })
                closePopup()
            }
        } catch (e) {
            error = locale(e.error)
            console.error(error)
        } finally {
            busy = false
        }
    }
</script>

<div class="flex w-full flex-row flex-wrap">
    <Text type="h4" classes="mb-5">
        {lastBackupDate
            ? locale('popups.backup.title', {
                  values: { date: formatDate(lastBackupDate, { format: 'long' }) },
              })
            : locale('popups.backup.notBackedUp')}
    </Text>
    <div class="w-full p-4 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
        <Logo width="50%" logo="logo-stronghold" />
    </div>
    <div class="w-full text-center my-6 md:px-8">
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
    <div class="flex flex-row justify-between space-x-4 w-full md:px-8 ">
        <form
            id="password-popup-form"
            class="flex justify-center w-full flex-row flex-wrap"
            on:submit|preventDefault={handleBackupClick}
        >
            <Password
                classes="w-full mb-5"
                bind:value={password}
                showRevealToggle
                {locale}
                disabled={busy}
                placeholder={locale('general.password')}
                autofocus
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
</div>

<style type="text/scss">
    img {
        width: 196px;
    }
</style>
