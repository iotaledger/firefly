<script lang="typescript">
    import { Button, Logo, Text } from 'shared/components'
    import { getVersionDetails, updateBusy, updateCheck, updateDownload, versionDetails } from 'shared/lib/appUpdater'
    import { closePopup } from 'shared/lib/popup'
    import { onMount } from 'svelte'
    import { formatDate } from 'shared/lib/i18n'

    export let locale

    function handleDownload() {
        updateDownload()
        closePopup()
    }
    function handleCancelClick() {
        closePopup()
    }

    onMount(async () => {
        // @ts-ignore: This value is replaced by Webpack DefinePlugin
        if (!devMode) {
            await getVersionDetails()
            await updateCheck()
        }
    })
</script>

<style type="text/scss">
    img {
        width: 196px;
    }
    .changelog {
        max-height: 50vh;
    }
</style>

<Text type="h4" classes="mb-5">{locale('popups.version.title', { values: { version: $versionDetails.currentVersion } })}</Text>
<div class="flex w-full flex-row flex-wrap">
    <div class="w-full p-4 bg-gray-50 dark:bg-gray-800 flex justify-center content-center">
        <Logo width="50%" logo="logo-firefly-full" />
    </div>
    {#if $versionDetails.upToDate}
        <div class="w-full text-center my-6 px-8">
            <Text type="h5" highlighted classes="mb-2">{locale('popups.version.upToDateTitle')}</Text>
            <Text smaller secondary>
                {locale('popups.version.upToDateDescription', { values: { version: $versionDetails.currentVersion } })}
            </Text>
        </div>
        <div class="flex flex-row justify-center w-full">
            <Button secondary onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        </div>
    {:else}
        <div class="my-6">
            <Text smaller highlighted classes="mb-2">
                {locale('popups.version.updateAvailable', { values: { version: $versionDetails.currentVersion } })}
            </Text>
            <Text type="h5" classes="mb-2">
                {locale('popups.version.updateDetails', {
                    values: {
                        version: $versionDetails.newVersion,
                        date: formatDate($versionDetails.newVersionReleaseDate, { format: 'long' }),
                    },
                })}
            </Text>
            <div class="changelog overflow-y-auto">
                <Text secondary classes="whitespace-pre-wrap">{$versionDetails.changelog}</Text>
            </div>
        </div>
        <div class="flex flex-row justify-between space-x-4 w-full px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
            <Button classes="w-1/2" onClick={() => handleDownload()} bind:disabled={$updateBusy}>
                {locale('actions.updateFirefly')}
            </Button>
        </div>
    {/if}
</div>
