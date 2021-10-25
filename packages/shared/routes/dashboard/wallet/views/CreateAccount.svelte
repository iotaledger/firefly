<script lang="typescript">
    import { Button, Input, Spinner, Text, Icon, WalletPreview } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import { MAX_ACCOUNT_NAME_LENGTH, wallet } from 'shared/lib/wallet'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { isLedgerProfile, activeProfile } from 'shared/lib/profile'
    import { showAppNotification } from 'shared/lib/notifications'
    import { localize } from 'shared/lib/i18n'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let error = ''

    export let onCreate = (..._: any[]): void => {}

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

    let accountAlias = ''
    let isBusy = false

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleColorClick = (color) => {
        selectedColor = color
    }

    const handlePatternClick = (pattern) => {
        selectedPattern = pattern
    }

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

            const _cancel = () => (isBusy = false)
            const _create = () =>
                onCreate(trimmedAccountAlias, (err) => {
                    isBusy = false

                    if(err) {
                        console.error(err?.error || err)

                        if($isLedgerProfile) {
                            displayNotificationForLedgerProfile('error', true, false, false, false, err)
                        } else {
                            showAppNotification({
                                type: 'error',
                                message: localize(err?.error || err)
                            })
                        }
                    }
                })

            if($isLedgerProfile) {
                promptUserToConnectLedger(false, _create, _cancel)
            } else {
                _create()
            }
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

        <!-- wallet preview -->
        <WalletPreview color={selectedColor} name={accountAlias} pattern={selectedPattern} />

        <!-- wallet alias -->
        <div class="w-full h-auto flex flex-col justify-between pb-5">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={locale('general.accountName')}
                autofocus
                submitHandler={handleCreateClick}
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
