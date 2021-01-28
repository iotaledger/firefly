<script>
    import { getContext } from 'svelte'
    import { date } from 'svelte-i18n'
    import { Text, Button } from 'shared/components'

    export let locale
    export let lastBackup

    let strongholdLocked = Math.random() < 0.5 // dummy
    const popupState = getContext('popupState')

    function handleUpdate() {
        // Do logic here
        popupState.set({ active: false })
        if (strongholdLocked) {
            popupState.set({ active: true, type: 'password', props: { onSuccess: triggerUpdate } })
        }
    }
    function handleCancelClick() {
        popupState.set({ active: false })
    }
    function triggerUpdate() {
        // Do logic here
    }
</script>

<style type="text/scss">
    img {
        width: 196px;
    }
</style>

<div class="flex w-full flex-row flex-wrap">
    <div class="w-full p-4 bg-gray-50 flex justify-center content-center"><img src="assets/logos/stronghold.svg" alt="" /></div>
    <div class="w-full text-center my-6 px-8">
        <Text type="h5" highlighted classes="mb-2">
            {#if !lastBackup}
                {locale('popups.backup.not_backed_up')}
            {:else}{locale('popups.backup.last_backup', { values: { date: $date(lastBackup, { format: 'long' }) } })}{/if}
        </Text>
        <Text smaller secondary>{locale('popups.backup.backup_description')}</Text>
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full px-8 ">
        <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" onClick={() => handleUpdate()}>{locale('actions.save_backup')}</Button>
    </div>
</div>
