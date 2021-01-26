<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Popup, DashboardPane } from 'shared/components'
    import { Send, Receive, AccountNavigation, AccountBalance, AccountActions, ManageAccount, AccountHistory } from '.'

    export let locale
    export let mobile
    export let account
    export let accounts
    export let transactions
    export let selectAccount = () => {}

    export let send;
    export let internalTransfer;

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
    <AccountNavigation {locale} {mobile} {account} {accounts} {_previous} {selectAccount} />
    {#key account}
        <div class="w-full h-full flex flex-row space-x-4 flex-auto">
            <DashboardPane classes="w-1/3 h-full flex flex-auto flex-col flex-shrink-0">
                <AccountBalance
                    {locale}
                    {mobile}
                    color={account.color}
                    balance={account.balance}
                    balanceEquiv={account.balanceEquiv} />
                <DashboardPane classes="p-8 -mt-5 h-full">
                    {#if state === AccountState.Init}
                        <AccountActions {locale} {mobile} {account} {AccountState} {_next} bind:showQR />
                    {:else if state === AccountState.Send}
                        <Send send={send} internalTransfer={internalTransfer} on:next={_next} on:previous={() => _previous(false)} {accounts} {locale} {mobile} />
                    {:else if state === AccountState.Transfer}
                        <Send send={send} internalTransfer={internalTransfer} internal on:next={_next} on:previous={() => _previous(false)} {accounts} {locale} {mobile} />
                    {:else if state === AccountState.Receive}
                        <Receive on:next={_next} on:previous={() => _previous(false)} {account} {locale} {mobile} />
                    {:else if state === AccountState.Manage}
                        <ManageAccount on:next={_next} on:previous={() => _previous(false)} {account} {locale} {mobile} />
                    {/if}
                </DashboardPane>
            </DashboardPane>
            <DashboardPane classes="w-1/3">
                <AccountHistory {locale} {mobile} {transactions} color={account.color} />
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
