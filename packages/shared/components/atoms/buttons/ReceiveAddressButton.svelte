<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'
    import { QR, Text } from 'shared/components'
    import { AddressBox } from 'shared/components/atoms'
    import { FontWeight } from 'shared/components/Text.svelte'

    let addressBoxElement: AddressBox

    $: receiveAddress = $selectedAccount.depositAddress
    $: darkModeEnabled = $appSettings.darkMode

    function handleReceiveClick(): void {
        addressBoxElement.copyAddress()
    }
</script>

<div
    class="flex flex-col px-4 py-4 space-y-2 rounded-xl cursor-pointer"
    class:darkmode={darkModeEnabled}
    on:click={handleReceiveClick}
>
    <Text type="h5" fontWeight={FontWeight.semibold} classes="text-left">{localize('general.receiveFunds')}</Text>
    <inner-box class="flex flex-col space-y-6 pt-9 pb-10">
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
</div>

<style type="text/scss">
    div {
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
