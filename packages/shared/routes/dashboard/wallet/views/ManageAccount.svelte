<script lang="typescript">
    import { Input, Text, Button } from 'shared/components'
    import { accountViewState, AccountViewStates } from 'shared/lib/app'

    export let locale
    export let name
    export let setAlias

    let accountName = name

    const handleSaveClick = () => {
        setAlias(accountName)
    }
    const handleCancelClick = () => {
        accountViewState.set(AccountViewStates.Init)
    }
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.manage_account')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <Input bind:value={accountName} placeholder={locale('general.account_name')} />
        </div>
    </div>
    <!-- Action -->
    <div class="flex flex-row justify-between px-2">
        <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="-mx-2 w-1/2" onClick={() => handleSaveClick()}>{locale('actions.save')}</Button>
    </div>
</div>
