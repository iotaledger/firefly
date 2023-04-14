<script lang="ts">
    import { Button, Text, TextType } from '@ui'
    // import { localize } from '@core/i18n'
    // import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'

    function onEditChainClick(): void {
        // $networkConfigRouter.goTo(NetworkConfigRoute.EditChain)
    }

    function onRemoveChainClick(): void {
        // $networkConfigRouter.goTo(NetworkConfigRoute.RemoveChain)
    }
</script>

<div class="flex flex-col justify-between mb-6">
    <div class="flex flex-row self-start justify-center content-center">
        <Text type={TextType.h4} classes="text-center">Chain information</Text>
    </div>

    <Button onClick={onEditChainClick} classes="mt-12" secondary>Edit chain</Button>
    <Button onClick={onRemoveChainClick} classes="mt-12" secondary>Remove chain</Button>
</div>
