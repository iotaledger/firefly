<script lang="typescript">
    import { localize } from '@core/i18n'
    import { AccountRoute, accountRouter } from '@core/router'
    import { Button, ColorPicker, Input, Text } from 'shared/components'
    import { mobile, isKeyboardOpened, keyboardHeight, getKeyboardTransitionSpeed } from 'shared/lib/app'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { activeProfile, getAccountColor, setProfileAccount } from 'shared/lib/profile'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { api, MAX_ACCOUNT_NAME_LENGTH, selectedAccountStore, wallet } from 'shared/lib/wallet'

    export let account
    export let error = ''

    const { accounts } = $wallet

    let accountAlias = account.alias
    let isBusy = false
    let color = getAccountColor(account.id) as string

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleSaveClick = () => {
        setProfileAccount($activeProfile, { id: $selectedAccountStore?.id, color })
        const trimmedAccountAlias = accountAlias.trim()
        if (trimmedAccountAlias === account?.alias) {
            $accountRouter.goTo(AccountRoute.Init)
            return
        }
        if (trimmedAccountAlias) {
            error = ''
            if (getTrimmedLength(trimmedAccountAlias) > MAX_ACCOUNT_NAME_LENGTH) {
                return (error = localize('error.account.length', {
                    values: {
                        length: MAX_ACCOUNT_NAME_LENGTH,
                    },
                }))
            }
            if ($accounts.find((a) => a.alias === trimmedAccountAlias)) {
                return (error = localize('error.account.duplicate'))
            }
            isBusy = true
            api.setAlias($selectedAccountStore?.id, trimmedAccountAlias, {
                onSuccess() {
                    accounts.update((_accounts) =>
                        _accounts.map((account) => {
                            if (account.id === $selectedAccountStore?.id) {
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
                    error = localize(err.error)
                },
            })
        }
    }
    const handleCancelClick = () => {
        error = ''
        $accountRouter.previous()
    }

    $: invalidAliasUpdate = !getTrimmedLength(accountAlias) || isBusy || accountAlias === account?.alias
    $: hasColorChanged = getAccountColor(account.id) !== color
</script>

<div
    class="w-full h-full flex flex-col justify-between {$mobile ? 'px-5 pt-6 mb-8' : 'p-6'}"
    style="padding-bottom: {$mobile && $isKeyboardOpened
        ? $keyboardHeight
        : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
        'ms'}  var(--transition-scroll)"
>
    <div>
        <div class="flex flex-row mb-6 {$mobile && 'justify-center'}">
            <Text type="h5">{localize('general.manageAccount')}</Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus={!$mobile}
                submitHandler={handleSaveClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    <!-- Action -->
    {#if isBusy && !error}
        <Text secondary classes="mb-3 text-center">{localize('general.updatingAccount')}</Text>
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between mt-2 px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()} disbled={isBusy}>
                {localize('actions.cancel')}
            </Button>
            <Button
                classes="-mx-2 w-1/2"
                onClick={() => handleSaveClick()}
                disabled={invalidAliasUpdate && !hasColorChanged}
            >
                {localize('actions.save')}
            </Button>
        </div>
    {/if}
</div>
