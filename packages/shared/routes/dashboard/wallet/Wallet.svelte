<script context="module" lang="typescript">
    export enum WalletState {
        Init = 'init',
        Account = 'account',
        Send = 'send',
        Receive = 'receive',
        CreateAccount = 'createAccount',
    }
</script>

<script lang="typescript">
    import { setContext } from 'svelte'
    import { writable, derived } from 'svelte/store'
    import { Popup, DashboardPane } from 'shared/components'
    import { Account, LineChart, WalletTx, Security, CreateAccount, WalletBalance, WalletActions } from './views/'
    import { accounts as dummyAccounts } from './dummydata'

    export let locale

    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']

    const DUMMY_WALLET_BALANCE = {
        incoming: '32 Gi',
        outgoing: '16 Gi',
        balance: '23.322,32 Mi',
        balanceEquiv: '45.500 USD',
    }
    const balance = writable(DUMMY_WALLET_BALANCE)
    const accounts = writable(dummyAccounts.map((acc, index) => ({ ...acc, color: AccountColors[index] })))
    const selectedAccountId = writable(null)
    const selectedAccount = derived([selectedAccountId, accounts], ([$selectedAccountId, $accounts]) =>
        $accounts.find((acc) => acc.id === $selectedAccountId)
    )
    const showPasswordPopup = writable(false)
    const state = writable(WalletState.Init)

    setContext('walletBalance', balance)
    setContext('walletAccounts', accounts)
    setContext('selectedAccountId', selectedAccountId)
    setContext('selectedAccount', selectedAccount)
    setContext('walletState', state)
    setContext('showPasswordPopup', showPasswordPopup)

    let stateHistory = []
    const _next = (request) => {
        if (request instanceof CustomEvent) {
            request = request.detail || {}
        }
        let nextState
        switch ($state) {
            case WalletState.Account:
            case WalletState.CreateAccount:
            case WalletState.Init:
                const { accountId } = request
                if (Object.values(WalletState).includes(request as WalletState)) {
                    nextState = request
                } else if (accountId) {
                    const account = $accounts.find((account) => account.id === accountId)
                    if (account) {
                        selectedAccountId.set(accountId)
                        _next(WalletState.Account)
                    } else {
                        console.error('Error selecting account')
                    }
                }
                break
            case WalletState.Receive:
                // do logic here
                nextState = WalletState.Init
                break
            case WalletState.Send:
                // do logic here
                nextState = WalletState.Init
                break
        }
        if (nextState) {
            if (nextState !== $state) {
                stateHistory.push($state)
            }
            stateHistory = stateHistory
            state.set(nextState)
        }
    }
    const _previous = () => {
        let prevState = stateHistory.pop()
        if (prevState) {
            if ($state === WalletState.Account) {
                selectedAccountId.set(null)
            }
            state.set(prevState)
        }
    }
</script>

<Popup
    bind:active={$showPasswordPopup}
    {locale}
    type="password"
    title={locale('popups.password.title')}
    subtitle={locale('popups.password.subtitle')} />
{#if $state === WalletState.Account && $selectedAccountId}
    <Account on:next={_next} on:previous={_previous} {locale} />
{:else}
    <div class="w-full h-full flex flex-col p-10">
        <div class="w-full h-full flex flex-row space-x-4 flex-auto">
            <DashboardPane classes="w-1/3 h-full">
                <!-- Total Balance, Accounts list & Send/Receive -->
                <div class="flex flex-auto flex-col flex-shrink-0 h-full">
                    {#if $state === WalletState.CreateAccount}
                        <CreateAccount on:next={_next} on:previous={_previous} {locale} />
                    {:else}
                        <WalletBalance {locale} />
                        <DashboardPane classes="-mt-5 h-full">
                            <WalletActions on:next={_next} on:previous={_previous} {locale} />
                        </DashboardPane>
                    {/if}
                </div>
            </DashboardPane>
            <div class="flex flex-col w-2/3 h-full space-y-4">
                <DashboardPane classes="w-full">
                    <LineChart />
                </DashboardPane>
                <div class="w-full flex flex-row flex-1 space-x-4">
                    <DashboardPane classes="w-1/2">
                        <WalletTx {locale} />
                    </DashboardPane>
                    <DashboardPane classes="w-1/2">
                        <Security {locale} />
                    </DashboardPane>
                </div>
            </div>
        </div>
    </div>
{/if}
