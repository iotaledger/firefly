<script lang="typescript">
    import { Popup, DashboardPane } from 'shared/components'
    import { Account, WalletFrontDesk, LineChart, WalletTx, Security } from './views/'
    import { totalBalance as dummyTotalBalance, transactions as dummyTransactions, accounts as dummyAccounts } from './dummydata'

    export let locale
    export let mobile

    const AccountColors = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']

    enum WalletState {
        Init = 'init',
        Account = 'account',
        Send = 'send',
        Receive = 'receive',
        CreateAccount = 'createAccount',
    }

    let totalBalance = dummyTotalBalance
    let transactions = dummyTransactions
    let accounts = dummyAccounts.map((acc) => ({ ...acc, color: AccountColors[acc.index] }))

    let state: WalletState = WalletState.Init
    let stateHistory = []
    const _next = (request) => {
        let nextState
        switch (state) {
            case WalletState.Init:
                if (Object.values(WalletState).includes(request as WalletState)) {
                    nextState = request
                }
                break
            case WalletState.Send:
                // do logic here
                nextState = WalletState.Init
                break
        }
        if (nextState) {
            stateHistory.push(state)
            stateHistory = stateHistory
            state = nextState
        }
    }
    const _previous = () => {
        let prevState = stateHistory.pop()
        if (prevState) {
            if (state === WalletState.Account) {
                selectedAccount = null
            }
            state = prevState
        }
    }

    let selectedAccount = null
    const selectAccount = (index) => {
        selectedAccount = accounts.find((account) => account.index === index)
        if (selectedAccount) {
            _next('account')
        } else {
            console.error('Error selecting account')
        }
    }

    let showPasswordPopup = false
</script>

<Popup
    bind:active={showPasswordPopup}
    {locale}
    type="password"
    title="Password required"
    subtitle="Please provide your wallet’s password to confirm this transaction." />
{#if state === WalletState.Account && selectedAccount}
    <Account
        account={selectedAccount}
        {accounts}
        {selectAccount}
        {locale}
        {mobile}
        transactions={transactions.filter((tx) => tx.account === selectedAccount.index)}
        on:previous={_previous} />
{:else}
    <div class="w-full h-full flex flex-col p-10">
        <div class="w-full h-full flex flex-row space-x-4 flex-auto">
            <DashboardPane classes="w-1/3 h-full">
                <WalletFrontDesk
                    {locale}
                    {mobile}
                    {state}
                    {_next}
                    {_previous}
                    {accounts}
                    {totalBalance}
                    {selectAccount}
                    {WalletState} />
            </DashboardPane>
            <div class="flex flex-col w-2/3 h-full space-y-4">
                <DashboardPane>
                    <LineChart />
                </DashboardPane>
                <div class="w-full flex flex-row flex-1 space-x-4">
                    <DashboardPane classes="w-1/2">
                        <WalletTx {locale} {mobile} {transactions} {accounts} />
                    </DashboardPane>
                    <DashboardPane classes="w-1/2">
                        <Security {locale} {mobile} />
                    </DashboardPane>
                </div>
            </div>
        </div>
    </div>
{/if}
