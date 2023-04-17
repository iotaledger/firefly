<script lang="ts">
    import { Button } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'

    function onNetworkCardClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainInformation)
    }

    function onQrCodeIconClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainDepositAddress)
    }

    function onAddChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.AddChain)
    }
</script>

<connected-chains-drawer class="flex flex-col justify-between mb-6">
    <Button onClick={onNetworkCardClick}>Chain information</Button>
    <Button onClick={onQrCodeIconClick} classes="mt-6">Chain deposit address</Button>
    <Button onClick={onAddChainClick} classes="mt-6">Add chain</Button>
</connected-chains-drawer>
