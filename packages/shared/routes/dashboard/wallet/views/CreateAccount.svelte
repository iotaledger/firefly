<script lang="typescript">
    import { Button, Input, Spinner, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import { MAX_ACCOUNT_NAME_LENGTH, wallet } from 'shared/lib/wallet'
    import { notifyLedgerDeviceState, promptUserToConnectLedger } from 'shared/lib/ledger'

    export let locale
    export let onCreate
    export let error = ''

    const { accounts } = $wallet

    let accountAlias = ''
    let isBusy = false

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleCreateClick = () => {
        const trimmedAccountAlias = accountAlias.trim()
        if (trimmedAccountAlias) {
            error = ''

            if (getTrimmedLength(trimmedAccountAlias) > MAX_ACCOUNT_NAME_LENGTH) {
                return (error = locale('error.account.length', {
                    values: {
                        length: MAX_ACCOUNT_NAME_LENGTH,
                    },
                }))
            }

            if ($accounts.find((a) => a.alias === trimmedAccountAlias)) {
                return (error = locale('error.account.duplicate'))
            }

            isBusy = true

            onCreate(trimmedAccountAlias, (err) => {
                isBusy = false

                console.error(err?.error)

                notifyLedgerDeviceState('error', true, true)
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
            <Text type="h5">{locale('general.createAccount')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={locale('general.accountName')}
                autofocus
                submitHandler={handleCreateClick}
                disabled={isBusy} />
        </div>
    </div>
    <!-- Action -->
    {#if isBusy && !error}
        <Spinner busy={true} message={locale('general.creatingAccount')} classes="justify-center mb-4" />
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
            <Button
                disabled={!getTrimmedLength(accountAlias) || isBusy}
                classes="-mx-2 w-1/2"
                onClick={() => handleCreateClick()}>
                {locale('actions.create')}
            </Button>
        </div>
    {/if}
</div>
