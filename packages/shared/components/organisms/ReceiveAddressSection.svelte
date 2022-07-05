<script lang="typescript">
    import { appSettings } from '@core/app'
    import { QR, Text } from 'shared/components'
    import { AddressBox, OnboardingButton } from 'shared/components/atoms'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { openPopup } from '@lib/popup'

    export let addressFontSize = 'base'

    let addressBoxElement: AddressBox

    $: recieveAddress = $selectedAccount.meta.publicAddresses[0].address
    $: darkModeEnabled = $appSettings.darkMode

    function handleSendClick() {
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }

    function handleRecieveClick() {
        addressBoxElement.copyAddress()
    }
</script>

<receive-details class="flex flex-col space-y-6 justify-between cursor-pointer">
    <OnboardingButton primaryText={'Send funds'} secondaryText="Send tokens to an address" onClick={handleSendClick} />
    <div
        class="flex flex-col px-4 py-4 space-y-6 rounded-xl"
        class:darkmode={darkModeEnabled}
        on:click={handleRecieveClick}
    >
        <Text type="h5" fontWeight={FontWeightText.semibold} classes="text-left"
            >{localize('general.receiveFunds')}</Text
        >
        <QR data={recieveAddress} classes="w-3/5 h-auto" />
        <AddressBox
            bind:this={addressBoxElement}
            clearBackground
            clearPadding
            address={recieveAddress}
            fontSize={addressFontSize}
            isCopyable
        />
    </div>
</receive-details>

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
