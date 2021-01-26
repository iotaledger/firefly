<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Input, Text, Button } from 'shared/components'

    export let locale
    export let onCreate

    const dispatch = createEventDispatcher()

    let accountName

    const handleCreateClick = () => {
        onCreate(accountName)
    }
    const handleCancelClick = () => {
        dispatch('previous')
    }
</script>

<div class="px-8 py-6 flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.create_account')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <Input bind:value={accountName} placeholder={locale('general.account_name')} />
        </div>
    </div>
    <!-- Action -->
    <div class="flex flex-row justify-between px-2">
        <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button disabled={!accountName} classes="-mx-2 w-1/2" onClick={() => handleCreateClick()}>
            {locale('actions.create')}
        </Button>
    </div>
</div>
