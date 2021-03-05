<script lang="typescript">
    import { Input, Text, Button } from 'shared/components'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import {
        api,
        selectedAccountId,
        wallet,
        WalletAccount,
    } from 'shared/lib/wallet'

    const MAX_ACCOUNT_NAME_LENGTH = 20

    export let locale
    export let name
    export let error = ''

    let accountName = name

    const { accounts } = $wallet

    const handleSaveClick = () => {
        if (accountName.length > MAX_ACCOUNT_NAME_LENGTH) {
            return error = locale('error.account.length', { 
                values: {
                    length: MAX_ACCOUNT_NAME_LENGTH
                }
            })
        }
        api.setAlias($selectedAccountId, accountName, {
            onSuccess(res) {
                accounts.update((_accounts) => {
                    return _accounts.map((account) => {
                        if (account.id === $selectedAccountId) {
                            return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                {} as WalletAccount,
                                account,
                                {
                                    alias: accountName,
                                }
                            )
                        }

                        return account
                    })
                })

                walletRoute.set(WalletRoutes.Init)
            },
            onError(err) {
                error = locale(err.error)
            },
        })
    }
    const handleCancelClick = () => {
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<div class="w-full h-full flex flex-col justify-between p-8">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.manage_account')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <Input {error} bind:value={accountName} placeholder={locale('general.account_name')} />
        </div>
    </div>
    <!-- Action -->
    <div class="flex flex-row justify-between px-2">
        <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="-mx-2 w-1/2" onClick={() => handleSaveClick()}>{locale('actions.save')}</Button>
    </div>
</div>
