<script lang="ts">
    import { IIscpChainConfiguration, isIscpChain, selectedChain } from '@core/network'
    import { appSettings } from '@core/app'
    import { QR, AddressBox, FontWeight } from '@ui'
    import { Text } from '@ui'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'

    let addressBoxElement: AddressBox

    let depositAddress = ''
    $: {
        if ($selectedChain) {
            const configuration = $selectedChain.getConfiguration() as IIscpChainConfiguration
            depositAddress = isIscpChain(configuration) ? $selectedAccount.evmAddress : undefined
        } else {
            depositAddress = $selectedAccount.depositAddress
        }
    }

    function onReceiveClick(): void {
        addressBoxElement.copyAddress()
    }
</script>

{#key depositAddress}
    <div class="w-full h-full flex items-center justify-center">
        <button
            class="flex flex-col px-4 py-4 space-y-2 rounded-xl cursor-pointer"
            class:darkmode={$appSettings.darkMode}
            on:click={onReceiveClick}
        >
            <inner-box class="flex flex-col space-y-6 pt-7 pb-6">
                <QR data={depositAddress} />
                <div class="flex flex-col space-y-1">
                    <Text fontWeight={FontWeight.medium} color="gray-600" darkColor="white"
                        >{localize('general.myAddress')}</Text
                    >
                    <AddressBox
                        bind:this={addressBoxElement}
                        clearBackground
                        clearPadding
                        address={depositAddress}
                        fontSize="sm"
                        isCopyable
                    />
                </div>
            </inner-box>
        </button>
    </div>
{/key}

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
