<script lang="ts">
    import { DashboardRoute, dashboardRouter } from '@core/router'
    import { selectedWallet } from '@core/wallet'
    import { ImplicitAccountCreationView } from '@views'
    export let outputId: string | undefined

    function handleOutdatedOutput() {
        $dashboardRouter.goTo(DashboardRoute.Wallet)
    }

    $: existOutputInUnspentOutputs = $selectedWallet.walletUnspentOutputs.some((output) => outputId === output.outputId)
    $: !existOutputInUnspentOutputs && handleOutdatedOutput()
</script>

<ImplicitAccountCreationView {outputId} />
