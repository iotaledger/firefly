<script lang="ts">
    import { Button, Text, TextType } from '@ui'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'

    function onEditChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.EditChain)
    }

    function onRemoveChainClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.RemoveChain)
    }
</script>

<chain-information-side-drawer class="flex flex-col justify-between mb-6">
    <div class="flex flex-row self-start justify-center content-center">
        <Text type={TextType.h4} classes="text-center">Chain information</Text>
    </div>

    <Button onClick={onEditChainClick} classes="mt-12">Edit chain</Button>
    <Button onClick={onRemoveChainClick} classes="mt-12">Remove chain</Button>
</chain-information-side-drawer>
