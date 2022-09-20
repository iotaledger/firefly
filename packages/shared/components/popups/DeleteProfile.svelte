<script lang="typescript">
    import { Button, Text, Spinner } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@lib/popup'
    import { deleteProfile } from '@contexts/settings'

    let isBusy = false

    async function handleDeleteClick(): Promise<void> {
        isBusy = true
        await deleteProfile()
        isBusy = false
    }
</script>

<Text type="h4" classes="mb-5">{localize('popups.deleteProfile.title')}</Text>
<div class="w-full h-full mb-5">
    <Text classes="mb-3">{localize('popups.deleteProfile.confirmation')}</Text>
</div>
<div class="flex flex-row justify-between space-x-4 w-full">
    <Button secondary classes="w-1/2" onClick={closePopup} disabled={isBusy}>{localize('actions.no')}</Button>
    <Button disabled={isBusy} classes="w-1/2" onClick={handleDeleteClick} warning>
        {#if isBusy}
            <Spinner busy classes="justify-center" />
        {:else}
            {localize('actions.yes')}
        {/if}
    </Button>
</div>
