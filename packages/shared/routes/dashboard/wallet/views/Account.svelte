<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { fade } from 'svelte/transition'
    import { getInitials } from 'shared/lib/helpers'
    import { Dropdown, ActivityRow, Text, Button, Icon, Popup } from 'shared/components'
    import { CurrencyTypes, chartCurrency, chartTimeframe, TIMEFRAME_MAP } from 'shared/lib/marketData'
    import { Send, Receive } from '.'
    import ManageAccount from './ManageAccount.svelte'

    export let locale
    export let mobile
    export let account
    export let accounts
    export let transactions
    export let selectAccount = () => {}

    const dispatch = createEventDispatcher()

    let showQR = false

    enum AccountState {
        Init = 'init',
        Manage = 'manage',
        Send = 'send',
        Transfer = 'transfer',
        Receive = 'receive',
    }
    let state: AccountState = AccountState.Init
    let stateHistory = []
    const _next = (request) => {
        let nextState
        switch (state) {
            case AccountState.Init:
                if (Object.values(AccountState).includes(request as AccountState)) {
                    nextState = request
                }
                break
            case AccountState.Send:
                // do logic here
                nextState = AccountState.Init
                break
            case AccountState.Transfer:
                // do logic here
                nextState = AccountState.Init
                break
            case AccountState.Manage:
                // do logic here
                nextState = AccountState.Init
                break
        }
        if (nextState) {
            stateHistory.push(state)
            stateHistory = stateHistory
            state = nextState
        }
    }
    const _previous = (exit: boolean) => {
        let prevState = stateHistory.pop()
        if (!exit) {
            state = prevState
        } else {
            dispatch('previous')
        }
    }
</script>

<Popup bind:active={showQR} qrData={account.address} type="qr" title="Your QR code" />
<div class="w-full h-full flex flex-col flex-nowrap px-10 pb-10">
    <!-- Selected account top bar: back, account name, account switcher -->
    <div class="relative flex flex-row justify-center items-center w-full py-5">
        <div class="absolute left-0">
            <Button secondary small icon="arrow-left" iconReverse onClick={() => _previous(true)}>Back</Button>
        </div>
        <Text type="h3" classes="text-center">{account.name}</Text>
        <div class="absolute right-0 flex flex-row space-x-4 account-switch">
            {#each accounts as acc}
                <button
                    on:click={() => selectAccount(acc.index)}
                    class="w-10 h-10 rounded-xl p-2 text-14 leading-140 font-bold text-center
                    {account.index === acc.index ? `bg-${acc.color}-500 text-white` : 'bg-gray-200 text-gray-500'} 
                    hover:bg-{acc.color}-500 hover:text-white">{getInitials(acc.name, 2)}
                </button>
            {/each}
        </div>
    </div>
    {#key account}
        <div transition:fade class="w-full h-full flex flex-row space-x-4 flex-auto">
            <!-- Total Balance, Actions & Send/Receive -->
            <div class="flex flex-auto flex-col w-1/3 h-full flex-shrink-0">
                <div
                    class="bg-gradient-to-b from-{account.color}-500 to-{account.color}-600 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl pt-7 pb-10 px-8">
                    <!-- Balance -->
                    <div data-label="total-balance">
                        <Text type="p" overrideColor smaller classes="text-white mb-2">{locale('general.total_balance')}</Text>
                        <Text type="h2" overrideColor classes="text-white mb-2">{account.balance}</Text>
                        <Text type="p" overrideColor smaller classes="text-white dar:text-blue-300 text-opacity-70 ">
                            {account.balanceEquiv}
                        </Text>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 -mt-5 flex flex-col h-full justify-between">
                    <!-- Actions & Send/Receive -->
                    {#if state === AccountState.Init}
                        <div class="flex flex-col justify-between">
                            <!-- Account actions -->
                            <div class="flex flex-row mb-6 justify-between items-center">
                                <button
                                    on:click={() => (showQR = true)}
                                    class="w-full rounded-2xl bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center p-4 text-left">
                                    <div class="flex flex-row mr-4 flex-wrap">
                                        <p class="text-gray-500 mb-2 text-10 leading-140">Account Address</p>
                                        <pre class="text-gray-800 dark:text-white text-11 leading-140">{account.address}</pre>
                                    </div>
                                    <div class="flex-1 items-end flex flex-col">
                                        <Icon classes="text-gray-500" icon="qr" />
                                    </div>
                                </button>
                            </div>
                            <div class="flex flex-col mb-6 justify-between items-center">
                                <Button
                                    icon="transfer"
                                    classes="w-full mb-5 p-4"
                                    secondary
                                    onClick={() => _next(AccountState.Transfer)}>
                                    {locale('general.transfer_between_accounts')}
                                    <Text type="p" secondary>{locale('general.move_funds_between_accounts')}</Text>
                                </Button>
                                <Button
                                    icon="transfer"
                                    classes="w-full mb-5 p-4"
                                    secondary
                                    onClick={() => _next(AccountState.Manage)}>
                                    {locale('general.manage_account')}
                                    <Text type="p" secondary>{locale('general.customize_account')}</Text>
                                </Button>
                            </div>
                        </div>
                        <!-- Send / Receive -->
                        <div class="flex flex-row justify-between space-x-4">
                            <Button xl secondary icon="receive" classes="w-1/2" onClick={() => _next(AccountState.Receive)}>
                                {locale('actions.receive')}
                            </Button>
                            <Button xl secondary icon="transfer" classes="w-1/2" onClick={() => _next(AccountState.Send)}>
                                {locale('actions.send')}
                            </Button>
                        </div>
                    {:else if state === AccountState.Send}
                        <Send on:next={_next} on:previous={() => _previous(false)} {accounts} {locale} {mobile} />
                    {:else if state === AccountState.Transfer}
                        <Send internal on:next={_next} on:previous={() => _previous(false)} {accounts} {locale} {mobile} />
                    {:else if state === AccountState.Receive}
                        <Receive on:next={_next} on:previous={() => _previous(false)} {account} {locale} {mobile} />
                    {:else if state === AccountState.Manage}
                        <ManageAccount on:next={_next} on:previous={() => _previous(false)} {account} {locale} {mobile} />
                    {/if}
                </div>
            </div>
            <!-- Transactions -->
            <div
                data-label="latest-transactions"
                class="w-1/3 bg-white dark:bg-gray-800 rounded-2xl p-8 flex-auto h-full flex-grow flex flex-col flex-shrink-0">
                <Text type="h4" classes="mb-5">History</Text>
                <div class="overflow-y-auto flex-auto h-1 space-y-2">
                    {#each transactions as transaction}
                        <ActivityRow {...transaction} color={account.color} />
                    {/each}
                </div>
            </div>
            <!-- Account Charts -->
            <div class="flex flex-col w-1/3 h-full space-y-4">
                <!-- Account Value -->
                <div data-label="portfolio-token-chart" class="h-1/2 w-full bg-white rounded-2xl px-10 pt-8 pb-6">
                    <div class="flex justify-between">
                        <Text type="h4">Account Value</Text>
                        <div class="flex">
                            <span>
                                <Dropdown
                                    value={$chartCurrency.toUpperCase()}
                                    items={Object.values(CurrencyTypes).map((currency) => ({
                                        value: currency,
                                        label: currency.toUpperCase(),
                                    }))}
                                    onSelect={(newCurrency) => chartCurrency.set(newCurrency)} />
                            </span>
                            <span class="ml-6">
                                <Dropdown
                                    value={TIMEFRAME_MAP[$chartTimeframe]}
                                    items={Object.keys(TIMEFRAME_MAP).map((value) => ({ label: TIMEFRAME_MAP[value], value }))}
                                    onSelect={(newTimeframe) => chartTimeframe.set(newTimeframe)} />
                            </span>
                        </div>
                    </div>
                </div>
                <!-- Account Activity -->
                <div class="h-1/2 w-full flex flex-row flex-1 space-x-4">
                    <div data-label="security" class="bg-white rounded-2xl w-1/2 p-8 flex-grow flex flex-col">
                        <Text type="h4">Account Activity</Text>
                    </div>
                </div>
            </div>
        </div>
    {/key}
</div>
