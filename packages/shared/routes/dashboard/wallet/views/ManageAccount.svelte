<script lang="typescript">
    import { Button, Input, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { updateWalletStyle } from 'shared/lib/wallet'
    import { api, MAX_ACCOUNT_NAME_LENGTH, selectedAccountId, wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { WalletDetails } from '.'
    import { getContext } from 'svelte'
    import type { Writable } from 'svelte/store'

    export let locale: Locale

    export let alias : string
    export let error = ''
    export let balance
    export let balanceEquiv

    let selectedColor = $wallet.style.color;
    let selectedPattern = $wallet?.style?.pattern

    const account = getContext<Writable<WalletAccount>>('selectedAccount')
    const viewableAccounts = getContext<Writable<WalletAccount[]>>('viewableAccounts')


    const { accounts } = $wallet
    let navAccounts
    $: navAccounts = $account
        ? $viewableAccounts.map(({ id, alias, color }) => ({ id, alias, color, active: $account.id === id }))
        : []

    const accountAlias = alias
    let isBusy = false

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const setGlobalColor = () => {
        const active = navAccounts.find(acc => acc.active)

        active.color = selectedColor
    }

    const handleSaveClick = () => {
        // updateProfile('settings.color', selectedColor)
        // updateProfile('settings.pattern', selectedPattern)
        setGlobalColor()
        updateWalletStyle(selectedColor, selectedPattern)
    
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
                    accounts.update((_accounts) => _accounts.map((account) => {
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
                    }))

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
    <WalletDetails on:handleInputSubmit={handleSaveClick} {locale} bind:alias bind:selectedColor bind:selectedPattern {balance} {balanceEquiv}/>
    <!-- Action -->
    {#if isBusy && !error}
        <Text secondary classes="mb-3">{locale('general.updatingAccount')}</Text>
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()} disbled={isBusy}>
                {locale('actions.cancel')}
            </Button>
            <Button classes="-mx-2 w-1/2" onClick={() => handleSaveClick()} disabled={!getTrimmedLength(accountAlias) || isBusy}>
                {locale('actions.save')}
            </Button>
        </div>
    {/if}
</div>
