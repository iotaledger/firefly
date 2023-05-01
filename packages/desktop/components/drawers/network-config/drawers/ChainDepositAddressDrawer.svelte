<script lang="ts">
    import { selectedChainIndex } from '@core/network'
    import { appSettings } from '@core/app'
    import { QR, AddressBox, FontWeight } from '@ui'
    import { Text } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'

    let addressBoxElement: AddressBox
    let address: string = ''

    $: $selectedChainIndex, $selectedAccount, (address = getAddress())
    function getAddress(): string {
        if ($selectedChainIndex === 0) {
            return $selectedAccount.depositAddress
        } else {
            // TODO: Get address from selected chain
            // const chain = $network.getChain($selectedChainIndex - 1)
            return ''
        }
    }

    function onReceiveClick(): void {
        addressBoxElement.copyAddress()
    }
</script>

<div class="w-full h-full flex items-center justify-center">
    <button
        class="flex flex-col px-4 py-4 space-y-2 rounded-xl cursor-pointer"
        class:darkmode={$appSettings.darkMode}
        on:click={onReceiveClick}
    >
        <inner-box class="flex flex-col space-y-6 pt-7 pb-6">
            <QR data={address} />
            <div class="flex flex-col space-y-1">
                <Text fontWeight={FontWeight.medium} color="gray-600" darkColor="white"
                    >{localize('general.myAddress')}</Text
                >
                <AddressBox
                    bind:this={addressBoxElement}
                    clearBackground
                    clearPadding
                    {address}
                    fontSize="sm"
                    isCopyable
                />
            </div>
        </inner-box>
    </button>
</div>

<style type="text/scss">
    button {
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
