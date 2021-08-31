<script lang="typescript">
    import { Button, Input, Text, AccountTile, ColorPicker, PatternPicker } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { api, MAX_ACCOUNT_NAME_LENGTH, selectedAccountId, wallet, AccountColors, AccountPatterns } from 'shared/lib/wallet'
    import type { Locale } from 'shared/lib/typings/i18n'
    import type { WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale
    import { activeProfile, getColor, getPattern } from 'shared/lib/profile'
    import { setProfileAccount } from 'shared/lib/profile'

    export let alias
    export let account
    export let error = ''

    const { accounts } = $wallet

    let accountAlias = alias
    let isBusy = false
    let color = getColor($activeProfile, account.id)
    let pattern = getPattern($activeProfile, account.id)

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleSaveClick = () => {
        setProfileAccount($activeProfile, { id: $selectedAccountId, color, pattern })
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
                    accounts.update((_accounts) => {
                        return _accounts.map((account) => {
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
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.manageAccount')}</Text>
        </div>
        <div class="w-full h-full flex flex-col justify-between">
            <AccountTile
                balance={account.balance}
                balanceEquiv={account.balanceEquiv}
                {color}
                disabledHover=true
                name={accountAlias || account.alias}
                {pattern}
                size='l' />
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={locale('general.accountName')}
                autofocus
                submitHandler={handleSaveClick}
                disabled={isBusy} />
            <ColorPicker title={locale('general.accountColor')} bind:active={color} {locale} />
            <PatternPicker title={locale('general.accountPattern')} bind:color bind:active={pattern} {locale} />
        </div>
    </div>
    <!-- Action -->
    {#if isBusy && !error}
        <Text secondary classes="mb-3 text-center">{locale('general.updatingAccount')}</Text>
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()} disbled={isBusy}>
                {locale('actions.cancel')}
            </Button>
            <Button classes="-mx-2 w-1/2" onClick={() => handleSaveClick()} disabled={!getTrimmedLength(accountAlias) || isBusy || accountAlias === alias}>
                {locale('actions.save')}
            </Button>
        </div>
    {/if}
</div>
