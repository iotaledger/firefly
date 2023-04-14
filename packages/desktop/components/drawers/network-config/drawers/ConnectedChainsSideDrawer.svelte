<script lang="ts">
    import { Button, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'

    function onNetworkCardClick(): void {
        $networkConfigRouter.goTo(NetworkConfigRoute.ChainInformation)
    }
</script>

<div class="flex flex-col justify-between mb-6">
    <div class="flex flex-row self-start justify-center content-center">
        <Text type={TextType.h4} classes="text-center">
            {localize('views.dashboard.drawers.networkConfig.connectedChains.title')}
        </Text>
    </div>

    <Button onClick={onNetworkCardClick} classes="mt-12">Chain information</Button>
</div>
