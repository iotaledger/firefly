<script lang="typescript">
    import { Sidebar } from 'shared/components'
    import { Wallet } from 'shared/routes'

    export let locale
    export let mobile
    enum DashboardState {
        Wallet = 'wallet',
        Settings = 'settings'
    }
    let state: DashboardState = DashboardState.Wallet
    let stateHistory = []
    const _next = (request) => {
        let nextState = request
        if (nextState) {
            stateHistory.push(state)
            stateHistory = stateHistory
            state = nextState
        }
    }
    const _prev = (event) => {
        const _previous = () => {
            let prevState = stateHistory.pop()
            if (prevState) {
                state = prevState
            }
        }
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <div class="w-full h-full flex flex-row">
        <Sidebar />
        <!-- Dashboard Pane -->
        {#if state === DashboardState.Wallet}
            <Wallet mobile={mobile} locale={locale} />
        {:else if state === DashboardState.Settings}
        {/if}
    </div>
{/if}