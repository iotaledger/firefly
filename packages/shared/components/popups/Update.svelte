<script>
    import { getContext } from 'svelte'
    import { date } from 'svelte-i18n'
    import { Text, Button } from 'shared/components'

    export let locale
    export let currentVersion
    export let upToDate

    const popupState = getContext('popupState')

    let newVersion = '3.45' // dummy
    let newVersionReleaseDate = new Date() // dummy

    function handleUpdate() {
        popupState.set({ active: false })
    }
    function handleCancelClick() {
        popupState.set({ active: false })
    }
</script>

<style type="text/scss">
    img {
        width: 196px;
    }
</style>

<div class="flex w-full flex-row flex-wrap">
    <div class="w-full p-4 bg-gray-50 flex justify-center content-center">
        <img src="assets/logos/firefly_logo_complete_horizontal.svg" alt="" />
    </div>
    {#if upToDate}
        <div class="w-full text-center my-6 px-8">
            <Text type="h5" highlighted classes="mb-2">
                {locale('popups.update.up_to_date_title', { values: { version: currentVersion } })}
            </Text>
            <Text smaller secondary>
                {locale('popups.update.up_to_date_description', { values: { version: currentVersion } })}
            </Text>
        </div>
        <div class="flex flex-row justify-center w-full">
            <Button secondary onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        </div>
    {:else}
        <div class="my-6">
            <Text smaller highlighted classes="mb-2">
                {locale('popups.update.update_available', { values: { version: currentVersion } })}
            </Text>
            <Text type="h5" classes="mb-2">
                {locale('popups.update.update_details', {
                    values: { version: newVersion, date: $date(newVersionReleaseDate, { format: 'long' }) },
                })}
            </Text>
            <Text secondary classes="whitespace-pre-wrap">
                {`Fix: Bugs that prevent some transactions from confirming (#3039)
Fix: Poll for value transfers before data (#3039)
Fix: Add polling errors to the error log (#2987)
Fix: Crash when app returns from background on Android (#2982)
Fix: Crash while polling on Android (#2986)
Fix: Fingerprint scanner crash on Android (#2983)
Fix: Incorrect progress bar steps and translation not available displayed on send (#3020)`}
            </Text>
        </div>
        <div class="flex flex-row justify-between space-x-4 w-full px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
            <Button classes="w-1/2" onClick={() => handleUpdate()}>{locale('actions.update_firefly')}</Button>
        </div>
    {/if}
</div>
