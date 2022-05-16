<script lang="typescript">
    import { Button, ColorPicker, Input, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { getColor } from 'shared/lib/profile'
    import { api } from 'shared/lib/wallet'
    import { accountRouter, AccountRoute } from '@core/router'
    import { activeProfile } from '@core/profile'
    import { selectedAccount, IAccountState, MAX_ACCOUNT_NAME_LENGTH } from '@core/account'

    export let error = ''

    const { accounts } = $activeProfile

    let accountAlias = $selectedAccount.name
    let isBusy = false
    let color = $selectedAccount.color

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleSaveClick = () => {
        // setProfileAccount($activeProfile, { id: $selectedAccount?.id, color })
        const trimmedAccountAlias = accountAlias.trim()
        if (trimmedAccountAlias === $selectedAccount.name) {
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
            if ($accounts.find((a) => a.alias() === trimmedAccountAlias)) {
                return (error = localize('error.account.duplicate'))
            }
            isBusy = true
            api.setAlias($selectedAccount?.id, trimmedAccountAlias, {
                onSuccess() {
                    accounts.update((_accounts) =>
                        _accounts.map((account) => {
                            if (account.id === $selectedAccount?.id) {
                                return Object.assign<IAccountState, IAccountState, Partial<IAccountState>>(
                                    {} as IAccountState,
                                    account,
                                    {
                                        name: trimmedAccountAlias,
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

    $: invalidAliasUpdate = !getTrimmedLength(accountAlias) || isBusy || accountAlias === $selectedAccount.name
    $: hasColorChanged = getColor($activeProfile, $selectedAccount.id) !== color
</script>

<div class="flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{localize('general.manageAccount')}</Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
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
