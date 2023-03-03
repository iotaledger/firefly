<script lang="ts">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, KeyValueBox, Text, TextType, TextHint } from 'shared/components'
    import {
        setAppVersionDetails,
        appUpdateBusy,
        checkForAppUpdate,
        downloadAppUpdate,
        appVersionDetails,
        appStage,
    } from '@core/app'
    import { formatDate, localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'

    function handleDownload(): void {
        downloadAppUpdate()
        closePopup()
    }
    function handleCloseClick(): void {
        closePopup()
    }

    onMount(async () => {
        // @ts-expect-error: This value is replaced by Webpack DefinePlugin
        if (!devMode) {
            await setAppVersionDetails()
            checkForAppUpdate()
        }
    })
</script>

<Text type={TextType.h5} classes="mb-5">{localize('popups.appUpdate.title')}</Text>
<div class="flex w-full flex-col space-y-6">
    <div class="flex w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.appUpdate.installedVersion')}
            valueText={$appVersionDetails.currentVersion}
        />
        <KeyValueBox
            keyText={localize('popups.appUpdate.stage')}
            valueText={localize(`popups.appUpdate.${get(appStage)}`)}
        />
        {#if $appVersionDetails.upToDate}
            <TextHint success classes="w-full" text={localize('popups.appUpdate.latestInstalled')} />
        {:else}
            <KeyValueBox keyText={localize('popups.appUpdate.newVerion')} valueText={$appVersionDetails.newVersion} />
            <KeyValueBox
                keyText={localize('popups.appUpdate.releasedAt')}
                valueText={formatDate($appVersionDetails.newVersionReleaseDate, {
                    dateStyle: 'long',
                    timeStyle: 'medium',
                })}
            />
            <TextHint info classes="w-full" text={localize('popups.appUpdate.updateAvailable')} />
        {/if}
    </div>

    <div class="flex flex-row justify-center w-full space-x-4">
        {#if $appVersionDetails.upToDate}
            <Button classes="w-full" outline onClick={handleCloseClick}>{localize('actions.close')}</Button>
        {:else}
            <Button outline classes="w-1/2" onClick={handleCloseClick}>{localize('actions.cancel')}</Button>
            <Button classes="w-1/2" onClick={handleDownload} disabled={$appUpdateBusy}>
                {localize('actions.updateFirefly')}
            </Button>
        {/if}
    </div>
</div>
