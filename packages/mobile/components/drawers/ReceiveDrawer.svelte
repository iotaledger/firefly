<script lang="ts">
    import { AddressBox, QR, Text, TextType } from '@ui'

    import { selectedAccount } from '@core/account'

    let addressBoxElement: AddressBox

    $: receiveAddress = $selectedAccount?.depositAddress

    function handleClick(): void {
        addressBoxElement.copyAddress()
    }
</script>

<receive-details on:click={handleClick} class="w-full flex-auto flex flex-col items-center justify-center">
    <div class="flex w-full flex-col items-center space-y-6">
        <QR data={receiveAddress} />
        <Text type={TextType.h4}>{$selectedAccount?.name}</Text>
        <AddressBox
            bind:this={addressBoxElement}
            clearBackground
            clearPadding
            address={receiveAddress}
            fontSize="sm"
            isCopyable
        />
    </div>
</receive-details>
