<script context="module" lang="typescript">
    export enum AccountState {
        Init = 'init',
        Manage = 'manage',
        Send = 'send',
        Transfer = 'transfer',
        Receive = 'receive',
    }
</script>

<script lang="typescript">
    import { createEventDispatcher, getContext, setContext } from 'svelte'
    import { writable } from 'svelte/store'
    import { Popup, DashboardPane } from 'shared/components'
    import { AccountNavigation, AccountBalance, AccountActions, AccountHistory } from '.'

    export let locale
    export let send
    export let internalTransfer
    export let generateAddress

    const dispatch = createEventDispatcher()

    const state = writable(AccountState.Init)
    const showQrPopup = writable(false)
    setContext('accountState', state)
    setContext('showQrPopup', showQrPopup)

    const account = getContext('selectedAccount')
    const accounts = getContext('walletAccounts')
    const walletTransactions = getContext('walletTransactions')
    $: transactions = $walletTransactions.filter((tx) => tx.account === $account.index)
    $: navAccounts = $accounts.map(({ id, name, color }) => ({ id, name, color, active: $account.id === id }))

    let stateHistory = []
    const _next = (request) => {
        if (request instanceof CustomEvent) {
            request = request.detail || {}
        }
        const { accountId } = request
        if (accountId) {
            dispatch('next', { accountId })
            return
        }
        let nextState
        switch ($state) {
            case AccountState.Init:
                if (Object.values(AccountState).includes(request as AccountState)) {
                    nextState = request
                }
                break
            case AccountState.Send:
            case AccountState.Transfer:
            case AccountState.Manage:
                // do logic here
                nextState = AccountState.Init
                break
        }
        if (nextState) {
            stateHistory.push($state)
            stateHistory = stateHistory
            state.set(nextState)
        }
    }
    const _previous = (request) => {
        if (request instanceof CustomEvent) {
            request = request.detail || {}
        }
        const { exit } = request
        let prevState = stateHistory.pop()
        if (!exit) {
            state.set(prevState)
        } else {
            dispatch('previous')
        }
    }
</script>

<Popup bind:active={$showQrPopup} qrData={$account?.address} type="qr" title={locale('popups.qr.title')} />
<div class="w-full h-full flex flex-col flex-nowrap px-10 pb-10">
    <AccountNavigation {locale} on:next={_next} on:previous={_previous} accounts={navAccounts} />
    {#key $account}
        <div class="w-full h-full flex flex-row space-x-4 flex-auto">
            <DashboardPane classes="w-1/3 h-full flex flex-auto flex-col flex-shrink-0">
                <AccountBalance {locale} color={$account.color} balance={$account.balance} balanceEquiv={$account.balanceEquiv} />
                <DashboardPane classes="h-full -mt-5">
                    <AccountActions
                        on:next={_next}
                        on:previous={_previous}
                        {send}
                        {internalTransfer}
                        {generateAddress}
                        {locale} />
                </DashboardPane>
            </DashboardPane>
            <DashboardPane classes="w-1/3">
                <AccountHistory {locale} color={$account.color} {transactions} />
            </DashboardPane>
            <div class="w-1/3 h-full flex flex-col space-y-4">
                <!-- TODO Account Value -->
                <DashboardPane classes="h-1/2 w-full" />
                <!-- TODO  Account Activity -->
                <DashboardPane classes="h-1/2 w-full" />
            </div>
        </div>
    {/key}
</div>
