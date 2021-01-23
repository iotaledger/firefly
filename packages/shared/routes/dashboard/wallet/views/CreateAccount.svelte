<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { fly } from 'svelte/transition'
    import { Input, Text, Button } from 'shared/components'

    export let locale
    export let mobile

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

{#if mobile}
    <div>foo</div>
{:else}
    <div
        class="bg-white dark:bg-gray-800 rounded-2xl px-8 py-6 flex flex-col h-full justify-between"
        transition:fly={{ x: 360, duration: 280, opacity: 0 }}>
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
{/if}
