<script lang="ts">
    import { Button } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'

    function onEditChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.EditChain)
    }

    function onRemoveChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.RemoveChain)
    }
</script>

<chain-information-side-drawer class="flex flex-col justify-between mb-6">
    <Button onClick={onEditChainClick}>Edit chain</Button>
    <Button onClick={onRemoveChainClick} classes="mt-6">Remove chain</Button>
</chain-information-side-drawer>
