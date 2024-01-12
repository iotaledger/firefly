<script lang="ts">
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { setClipboard } from '@core/utils'
    import { selectedWallet } from '@core/wallet'
    import { onMount } from 'svelte'

    let isVisibleAddress: boolean = false
    let depositAddress: string = ''

    onMount(async () => {
        depositAddress = await $selectedWallet?.implicitAccountCreationAddress()
    })

    function showAddress() {
        isVisibleAddress = true
    }

    function onCopyClick(): void {
        setClipboard(depositAddress)
    }
</script>

<step-content class="flex flex-col items-center justify-between h-full pt-12">
    <div class="flex flex-col text-center px-4 space-y-4 max-w-md">
        <div class="flex items-center justify-center">
            <img
                src="assets/illustrations/implicit-account/show-one-time-address.svg"
                alt={localize('views.implicit-account-creation.steps.step1.title')}
            />
        </div>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold}
            >{localize('views.implicit-account-creation.steps.step1.view.title')}</Text
        >
        <Text type={TextType.h5} fontSize="15" color="blue-700" darkColor="blue-700" fontWeight={FontWeight.semibold}
            >{localize('views.implicit-account-creation.steps.step1.view.subtitle')}</Text
        >
        <Text type={TextType.h5} fontWeight={FontWeight.normal} color="gray-700" darkColor="gray-500"
            >{localize('views.implicit-account-creation.steps.step1.view.body')}</Text
        >
    </div>
    {#if !isVisibleAddress}
        <div class="pb-5">
            <div class="flex flex-row items-center space-x-24 bg-yellow-200 rounded-lg px-6 py-7 max-w-lg">
                <Text type={TextType.h4} fontWeight={FontWeight.medium} color="yellow-900" darkColor="yellow-900"
                    >{localize('views.implicit-account-creation.steps.step1.view.hiddenAddress.description')}</Text
                >
                <Button onClick={showAddress} classes="shrink-0"
                    >{localize('views.implicit-account-creation.steps.step1.view.hiddenAddress.action')}</Button
                >
            </div>
        </div>
    {:else}
        <div class="flex flex-col justify-center items-center space-y-3">
            <div
                class="flex flex-row items-center space-x-20 bg-gray-100 dark:bg-gray-800 rounded-lg px-6 py-4 max-w-lg"
            >
                <div class="flex flex-col space-y-1">
                    <Text type={TextType.h5} fontWeight={FontWeight.normal} darkColor="gray-400"
                        >{localize('views.implicit-account-creation.steps.step1.view.oneTimeAddress.title')}</Text
                    >
                    <Text
                        type={TextType.pre}
                        fontSize="14"
                        fontWeight={FontWeight.medium}
                        color="gray-900"
                        darkColor="white">{depositAddress}</Text
                    >
                </div>
                <Button outline onClick={onCopyClick} classes="shrink-0"
                    >{localize('views.implicit-account-creation.steps.step1.view.oneTimeAddress.action')}</Button
                >
            </div>
            <Text type={TextType.h5} fontWeight={FontWeight.normal} color="red-600" darkColor="red-600"
                >{localize('views.implicit-account-creation.steps.step1.view.oneTimeAddress.tip')}</Text
            >
        </div>
    {/if}
</step-content>
