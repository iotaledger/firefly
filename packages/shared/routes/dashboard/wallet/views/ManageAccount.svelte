<script lang="typescript">
    import { Button, Input, Text, Icon, WalletPreview } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { accountRoute, settingsChildRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { api, MAX_ACCOUNT_NAME_LENGTH, selectedAccountId, wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { updateProfile, activeProfile } from 'shared/lib/profile'

    export let locale: Locale

    export let alias
    export let error = ''

    const { accounts } = $wallet

    const availableColors = [
        'blue-400',
        'lightblue-500',
        'turquoise-500',
        'green-100',
        'yellow-500',
        'orange-500',
        'red-500',
        'purple-500',
    ]

    const availablePatterns = ['default', 'circles', 'clouds', 'clover', 'organic', 'rain', 'shapes', 'wind']

    let selectedColor = $activeProfile?.settings?.color
    let selectedPattern = $activeProfile?.settings?.pattern

    let accountAlias = alias
    let isBusy = false

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleColorClick = (color) => {
        selectedColor = color
    }

    const handlePatternClick = (pattern) => {
        selectedPattern = pattern
    }

    const handleSaveClick = () => {
        updateProfile('settings.color', selectedColor)
        updateProfile('settings.pattern', selectedPattern)

        const trimmedAccountAlias = accountAlias.trim()
        if (trimmedAccountAlias === alias) {
            /* TODO use this Id */
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

        <!-- wallet preview -->
        <WalletPreview color={selectedColor} name={accountAlias} pattern={selectedPattern} />

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
                <Text type="h5">{locale('general.walletColor')}</Text>
            </div>
            <div class="w-full h-full grid md:grid-cols-8 sm:grid-cols-4 gap-6">
                {#each availableColors as availableColor}
                    <div
                        class="bg-{availableColor} rounded-lg w-8 h-8 cursor-pointer hover:opacity-50 focus:ring-2 focus:ring-blue-600"
                        on:click={() => handleColorClick(availableColor)}>
                        {#if selectedColor === availableColor}
                            <Icon icon="checkmark" classes="h-full w-full text-white justify-self-center" />
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <!-- set wallet pattern -->
        <div class="w-full h-auto flex flex-col justify-between">
            <div class="flex flex-row mb-6">
                <Text type="h5">{locale('general.walletBackground')}</Text>
            </div>
            <div class="flex-col grid grid-cols-4 gap-4">
                {#each availablePatterns as availablePattern}
                    <div
                        class="rounded-xl h-28 bg-cover bg-{selectedPattern === availablePattern ? selectedColor : 'blue-50'} cursor-pointer hover:opacity-50 relative"
                        style="height: 100%; width: 100%"
                        on:click={() => handlePatternClick(availablePattern)}>
                        <img
                            class="object-cover z-0"
                            style={selectedPattern === availablePattern ? selectedColor : 'filter: invert(.5) sepia(1) saturate(5) hue-rotate(175deg);'}
                            width="100%"
                            height="100%"
                            src={`assets/patterns/wallet-backgrounds/${availablePattern}.svg`}
                            alt="" />
                        {#if selectedPattern === availablePattern}
                            <div class="bg-green-600 rounded-full absolute bottom-5 left-9">
                                <Icon icon="checkmark" classes="h-full w-full text-white justify-self-center" />
                            </div>
                        {/if}
                    </div>
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
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
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
