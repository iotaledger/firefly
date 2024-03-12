<script lang="ts">
    import { DashboardRoute, dashboardRouter } from '@core/router'
    import { selectedWallet } from '@core/wallet'
    import { ImplicitAccountCreationView } from '@views'

    export let outputId: string | undefined

    // Redirect to the dashboard when the output we passed previously has now been consumed
    $: isAccountActivated = $selectedWallet.walletUnspentOutputs.some((output) => outputId === output.outputId)
    $: !isAccountActivated && $dashboardRouter.goTo(DashboardRoute.Wallet)
</script>

<ImplicitAccountCreationView {outputId} />
