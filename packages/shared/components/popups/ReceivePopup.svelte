<script lang="typescript">
    import { Button, QR, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { setClipboard } from 'shared/lib/utils'
    import { selectedAccount } from '@core/account'

    $: receiveAddress = $selectedAccount.depositAddress
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text classes="text-left" type="h3">{localize('general.receiveFunds')}</Text>
    <div class="flex flex-auto items-center justify-center mb-6">
        <QR size={98} data={receiveAddress} classes="w-1/2 h-1/2" />
    </div>
    <div class="mb-6 flex flex-col items-center">
        <Text secondary classes="mb-6 text-xs">
            {localize('general.myNetworkAddress', {
                values: { networkName: $activeProfile.settings.networkConfig.network.name },
            })}
        </Text>
        <div class="w-full flex flex-col p-4 items-center rounded-lg bg-gray-50">
            <Text type="pre" classes="text-base">{receiveAddress.slice(0, receiveAddress.length / 2)}</Text>
            <Text type="pre" classes="text-base">{receiveAddress.slice(receiveAddress.length / 2)}</Text>
        </div>
    </div>
    <Button classes="w-full" secondary onClick={() => setClipboard(receiveAddress)} autofocus={false}>
        <Text bigger overrideColor="text-blue-500">{localize('general.copyToClipboard')}</Text>
    </Button>
</div>
