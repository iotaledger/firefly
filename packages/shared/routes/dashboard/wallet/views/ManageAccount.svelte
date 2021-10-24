<script lang="typescript">
    import { Button, Input, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { api, MAX_ACCOUNT_NAME_LENGTH, selectedAccountId, wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale

    export let alias
    export let error = ''

    const { accounts } = $wallet

    let availableColors = [
        'blue-400',
        'lightblue-500',
        'turquoise-500',
        'green-100',
        'yellow-500',
        'orange-500',
        'red-500',
        'purple-500',
    ]
    let availablePatterns = ['default', 'circles', 'clouds', 'clover', 'organic', 'rain', 'shapes', 'wind']

    let accountAlias = alias
    let isBusy = false

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleSaveClick = () => {
        const trimmedAccountAlias = accountAlias.trim()
        if (trimmedAccountAlias === alias) {
            selectedAccountId.set(null)
            walletRoute.set(WalletRoutes.Init)
            return
        }
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
            api.setAlias($selectedAccountId, trimmedAccountAlias, {
                onSuccess(res) {
                    accounts.update((_accounts) =>
                        _accounts.map((account) => {
                            if (account.id === $selectedAccountId) {
                                return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    account,
                                    {
                                        alias: trimmedAccountAlias,
                                    }
                                )
                            }

                            return account
                        })
                    )

                    isBusy = false
                    selectedAccountId.set(null)
                    walletRoute.set(WalletRoutes.Init)
                },
                onError(err) {
                    isBusy = false
                    error = locale(err.error)
                },
            })
        }
    }
    const handleCancelClick = () => {
        error = ''
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.manageAccount')}</Text>
        </div>
        <div class="w-full h-auto flex flex-col justify-between pb-5">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={locale('general.accountName')}
                autofocus
                submitHandler={handleSaveClick}
                disabled={isBusy} />
        </div>
        <!-- set wallet color -->
        <div class="w-full h-auto flex flex-col justify-center pb-5">
            <div class="flex flex-row mb-6">
                <Text type="h5">Wallet color</Text>
            </div>
            <div class="w-full h-full grid md:grid-cols-8 sm:grid-cols-4 gap-6">
                {#each availableColors as availableColor}
                    <div class="bg-{availableColor} rounded-lg w-8 h-8 cursor-pointer hover:opacity-50 focus:ring-4" />
                {/each}
            </div>
        </div>
        <!-- set wallet pattern -->
        <div class="w-full h-auto flex flex-col justify-center">
            <div class="flex flex-row mb-6">
                <Text type="h5">Wallet pattern</Text>
            </div>
            <div class="grid grid-cols-4 gap-4 justify-center">
                {#each availablePatterns as availablePattern}
                    <div
                        class="h-20 w-20 rounded-lg bg-cover bg-blue-500 bg-{availablePattern} cursor-pointer hover:opacity-50" />
                {/each}
            </div>
        </div>
    </div>
    <!-- Action -->
    {#if isBusy && !error}
        <Text secondary classes="mb-3">{locale('general.updatingAccount')}</Text>
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()} disbled={isBusy}>
                {locale('actions.cancel')}
            </Button>
            <Button
                classes="-mx-2 w-1/2"
                onClick={() => handleSaveClick()}
                disabled={!getTrimmedLength(accountAlias) || isBusy}>
                {locale('actions.save')}
            </Button>
        </div>
    {/if}
</div>
