<script lang="typescript">
    import { Input, Text, Button } from 'shared/components'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'

    export let locale
    export let onCreate
    export let error = ''

    let accountName

    const MAX_ACCOUNT_NAME_LENGTH = 20

    const handleCreateClick = () => {
        resetError()
        if (accountName.length > MAX_ACCOUNT_NAME_LENGTH) {
            return error = locale('error.account.length')
        }
        onCreate(accountName)
    }
    const handleCancelClick = () => {
        resetError()
        walletRoute.set(WalletRoutes.Init)
    }
    const resetError = () => {
        error = ''
    }
</script>

<div class="px-8 py-6 flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.create_account')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <Input {error} bind:value={accountName} placeholder={locale('general.account_name')} />
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
