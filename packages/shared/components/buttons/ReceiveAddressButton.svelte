<script lang="ts">
    import { selectedAccount } from '@core/account'
    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'
    import { QR, Text, FontWeight, AddressBox } from 'shared/components'

    let addressBoxElement: AddressBox

    $: receiveAddress = $selectedAccount.depositAddress
    $: darkModeEnabled = $appSettings.darkMode

    function onReceiveClick(): void {
        addressBoxElement.copyAddress()
        reportError('abcde123456789')
    }
</script>

<button
    type="button"
    class="flex flex-col px-4 py-4 space-y-2 rounded-xl cursor-pointer"
    class:darkmode={darkModeEnabled}
    on:click={onReceiveClick}
>
    <Text type="h5" fontWeight={FontWeight.semibold} classes="text-left">{localize('general.receiveFunds')}</Text>
    <inner-box class="w-full flex flex-col items-center space-y-6 py-4">
        <QR data={receiveAddress} />
        <AddressBox
            bind:this={addressBoxElement}
            clearBackground
            clearPadding
            address={receiveAddress}
            fontSize="sm"
            isCopyable
        />
    </inner-box>
</button>

<style lang="scss">
    button {
        @apply border;
        @apply border-solid;
        @apply border-gray-300;

        &:hover {
            @apply bg-blue-50;
            @apply border-gray-500;
        }
        &:active,
        &:focus {
            @apply bg-blue-100;
            @apply border-blue-400;
        }
        &.darkmode {
            @apply border-gray-700;
            &:hover,
            &:focus,
            &:active {
                @apply bg-gray-700;
                @apply bg-opacity-20;
                @apply border-opacity-50;
            }
            &:disabled {
                @apply bg-gray-700;
                @apply bg-opacity-10;
                @apply border-gray-700;
                @apply border-opacity-10;
            }
        }
    }
</style>
