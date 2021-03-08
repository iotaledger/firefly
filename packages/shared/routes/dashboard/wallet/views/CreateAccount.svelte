<script lang="typescript">
    import { Button, Input, Text } from 'shared/components'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import { wallet, MAX_ACCOUNT_NAME_LENGTH } from 'shared/lib/wallet'

    export let locale
    export let onCreate
    export let error = ''

    const { accounts } = $wallet

    let accountAlias
    let isBusy = false

    const handleCreateClick = () => {
        if (accountAlias) {
            error = ''
            if (accountAlias.length > MAX_ACCOUNT_NAME_LENGTH) {
                return (error = locale('error.account.length', {
                    values: {
                        length: MAX_ACCOUNT_NAME_LENGTH,
                    },
                }))
            }
            if ($accounts.find((a) => a.alias === accountAlias)) {
                return (error = locale('error.account.duplicate'))
            }
            isBusy = true
            onCreate(accountAlias, (err) => {
                error = err || ''
                isBusy = false
            })
        }
    }
    const handleCancelClick = () => {
        error = ''
        walletRoute.set(WalletRoutes.Init)
    }
</script>

<div class="px-8 py-6 flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.create_account')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={locale('general.account_name')}
                autofocus
                submitHandler={handleCreateClick}
                disabled={isBusy} />
        </div>
    </div>
    <!-- Action -->
    {#if isBusy && !error}
        <Text secondary classes="mb-3">{locale('general.creatingAccount')}</Text>
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
            <Button disabled={!accountAlias || isBusy} classes="-mx-2 w-1/2" onClick={() => handleCreateClick()}>
                {locale('actions.create')}
            </Button>
        </div>
    {/if}
</div>
