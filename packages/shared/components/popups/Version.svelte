<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, Logo, Text } from 'shared/components'
    import {
        setAppVersionDetails,
        appUpdateBusy,
        checkForAppUpdate,
        downloadAppUpdate,
        appVersionDetails,
        AppStage,
        appStage,
    } from '@core/app'
    import { Platform } from 'shared/lib/platform'
    import { formatDate, localize } from '@core/i18n'
    import { closePopup } from 'shared/lib/popup'

    let hasAutoUpdate = true
    let isPreRelease = true

    function handleDownload(): void {
        if (hasAutoUpdate) {
            downloadAppUpdate()
        } else {
            Platform.openUrl('https://firefly.iota.org')
        }
        closePopup()
    }
    function handleCloseClick(): void {
        closePopup()
    }

    onMount(async () => {
        // @ts-expect-error: This value is replaced by Webpack DefinePlugin
        if (!devMode) {
            await setAppVersionDetails()
            if (get(appStage) === AppStage.PROD) {
                isPreRelease = false
                checkForAppUpdate()
            }
        }
        const os = await Platform.getOS()
        hasAutoUpdate = os !== 'win32'
    })
</script>

<Text type="h4" classes="mb-5"
    >{localize('popups.version.title', { values: { version: $appVersionDetails.currentVersion } })}</Text
>
<div class="flex w-full flex-row flex-wrap">
    <div class="w-full p-4 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
        <Logo width="50%" logo="logo-firefly-full" />
    </div>
    {#if $appVersionDetails.upToDate}
        <div class="w-full text-center my-6 px-8">
            <Text type="h5" highlighted classes="mb-2">
                {#if isPreRelease}
                    <!-- Capitalize first letter of stage name -->
                    {`Firefly ${$appStage.toString().replace(/^\w/, (c) => c.toUpperCase())}`}
                {:else}
                    {localize('popups.version.upToDateTitle')}
                {/if}
            </Text>
            <Text smaller secondary>
                {#if isPreRelease}
                    {localize('popups.version.preReleaseDescription')}
                {:else}
                    {localize('popups.version.upToDateDescription', {
                        values: { version: $appVersionDetails.currentVersion },
                    })}
                {/if}
            </Text>
        </div>
        <div class="flex flex-row justify-center w-full">
            <Button secondary onClick={() => handleCloseClick()}>{localize('actions.close')}</Button>
        </div>
    {:else}
        <div class="my-6">
            <Text smaller highlighted classes="mb-2">
                {localize('popups.version.updateAvailable', { values: { version: $appVersionDetails.currentVersion } })}
            </Text>
            <Text type="h5" classes="mb-2">
                {localize('popups.version.updateDetails', {
                    values: {
                        version: $appVersionDetails.newVersion,
                        date: formatDate($appVersionDetails.newVersionReleaseDate, { format: 'long' }),
                    },
                })}
            </Text>
            <div class="changelog overflow-y-auto">
                <Text secondary classes="whitespace-pre-wrap">{$appVersionDetails.changelog}</Text>
            </div>
            {#if !hasAutoUpdate}
                <Text error classes="mt-4">{localize('popups.version.noAutoUpdate')}</Text>
            {/if}
        </div>
        <div class="flex flex-row justify-between space-x-4 w-full md:px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCloseClick()}>{localize('actions.cancel')}</Button>
            <Button classes="w-1/2" onClick={() => handleDownload()} disabled={$appUpdateBusy}>
                {localize('actions.updateFirefly')}
            </Button>
        </div>
    {/if}
</div>

<style type="text/scss">
    .changelog {
        max-height: 50vh;
    }
</style>
