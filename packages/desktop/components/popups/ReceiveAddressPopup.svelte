<script lang="ts">
    import { QR, Text, FontWeight, AddressBox } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedWallet } from '@core/wallet'

    export let title: string = localize('general.receiveFunds')

    $: receiveAddress = $selectedWallet.depositAddress
</script>

<receive-details class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">{title}</Text>
    <div class="flex w-full flex-col items-center space-y-6">
        <QR data={receiveAddress} />
        <AddressBox address={receiveAddress} clearBackground isCopyable />
    </div>
</receive-details>
