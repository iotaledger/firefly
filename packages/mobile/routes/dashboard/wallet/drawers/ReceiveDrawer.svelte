<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { FontWeight, QR, Text, TextType } from 'shared/components'
    import { Drawer } from '../../../../components'

    export let onClose: () => unknown = () => {}

    $: receiveAddress = $selectedAccount?.depositAddress
</script>

<Drawer {onClose} fullScreen>
    <receive-details class="w-full flex-auto flex flex-col items-center justify-center">
        <div class="flex w-full flex-col items-center space-y-6">
            <QR data={receiveAddress} />
            <Text type={TextType.h4}>{$selectedAccount?.name}</Text>
            <div class="w-full flex flex-col text-center">
                <Text type={TextType.pre} fontSize="16" fontWeight={FontWeight.normal}>
                    {receiveAddress.slice(0, receiveAddress.length / 2)}
                </Text>
                <Text type={TextType.pre} fontSize="16" fontWeight={FontWeight.normal}>
                    {receiveAddress.slice(receiveAddress.length / 2)}
                </Text>
            </div>
        </div>
    </receive-details>
</Drawer>
