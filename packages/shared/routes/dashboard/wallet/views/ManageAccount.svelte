<script lang="typescript">
    import { Button, Input, Text, AccountTile, ColorPicker } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { accountRouter, AccountRoute } from '@core/router'
    import { api, MAX_ACCOUNT_NAME_LENGTH, selectedAccountId, wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { setProfileAccount } from 'shared/lib/profile'

    export let alias
    export let account
    export let error = ''

    const { accounts } = $wallet

    let accountAlias = alias
    let isBusy = false
    let color = getColor($activeProfile, account.id) as string

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleSaveClick = () => {
        setProfileAccount($activeProfile, { id: $selectedAccountId, color })
        const trimmedAccountAlias = accountAlias.trim()
        if (trimmedAccountAlias === alias) {
            $accountRouter.goTo(AccountRoute.Init)
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
                onSuccess() {
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
                    $accountRouter.goTo(AccountRoute.Init)
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
        $accountRouter.previous()
    }

    $: invalidAliasUpdate = !getTrimmedLength(accountAlias) || isBusy || accountAlias === alias
    $: hasColorChanged = getColor($activeProfile, account.id) !== color
</script>

<div class="w-full h-full flex flex-col justify-between px-8 py-10">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{locale('general.manageAccount')}</Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <AccountTile
                balance={account.balance}
                balanceEquiv={account.balanceEquiv}
                {color}
                disabledHover
                name={accountAlias || account.alias}
                size="m"
                classes="mb-4"
            />
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={locale('general.accountName')}
                autofocus
                submitHandler={handleSaveClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={locale('general.accountColor')} bind:active={color} {locale} classes="mb-4" />
        </div>
    </div>
    <!-- Action -->
    {#if isBusy && !error}
        <Text secondary classes="mb-3 text-center">{locale('general.updatingAccount')}</Text>
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between mt-2 px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()} disbled={isBusy}>
                {locale('actions.cancel')}
            </Button>
            <Button
                classes="-mx-2 w-1/2"
                onClick={() => handleSaveClick()}
                disabled={invalidAliasUpdate && !hasColorChanged}
            >
                {locale('actions.save')}
            </Button>
        </div>
    {/if}
</div>
