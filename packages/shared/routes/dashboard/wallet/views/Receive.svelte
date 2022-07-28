<script lang="typescript">
    import { localize } from '@core/i18n'
    import { accountRouter } from '@core/router'
    import { mobile } from '@lib/app'
    import { Platform } from '@lib/platform'
    import { Button, Icon, QR, QRImage, Spinner, Text } from 'shared/components'
    import { activeProfile, isLedgerProfile } from 'shared/lib/profile'
    import { setClipboard } from 'shared/lib/utils'
    import { hasGeneratedALedgerReceiveAddress, isSyncing, selectedAccountStore } from 'shared/lib/wallet'

    export let isGeneratingAddress = false
    export let onGenerateAddress: (id: string) => void = () => {}

    let wrapperHeight = 0
    let wrapperWidth = 0

    // calculate the size of the QR code based on the available space and the max size
    $: qrSize = Math.max(Math.min(wrapperWidth - 225, wrapperHeight - 225, 200), 0)

    const generateNewAddress = (): void => {
        onGenerateAddress($selectedAccountStore.id)
    }

    const handleCloseClick = (): void => {
        $accountRouter.previous()
    }

    const handleShareClick = (depositAddress: string) => {
        void Platform.share(depositAddress)
    }
</script>

{#if $mobile}
    <main
        class="grid grid-flow-row-dense items-center justify-items-center p-5"
        style="grid-template-rows: 18fr 1fr 1fr 5fr 1fr"
    >
        <div class="grid mt-44 rounded-xl bg-white">
            <QRImage size={5} data={$selectedAccountStore.depositAddress} />
        </div>
        <Text type="h4" classes="p-4">
            {$activeProfile?.isDeveloperProfile
                ? `${$activeProfile.settings.networkConfig.network.name} ${localize('general.address')}`
                : localize('general.myAddress')}
        </Text>
        <Text type="p" classes="px-4 mb-10 break-all font-fira-mono">{$selectedAccountStore.depositAddress}</Text>
        <button
            class="flex flex-row justify-center items-start h-12 w-full text-blue-500 -mt-10"
            disabled={isGeneratingAddress}
            on:click={() => setClipboard($selectedAccountStore.depositAddress)}
        >
            <Icon icon="copy" classes="text-blue-500 dark:text-blue-500" />
            {localize('general.copyAddress')}
        </button>
        <div class="flex flex-col space-y-4 justify-center items-center h-12 w-full">
            <Button
                disabled={isGeneratingAddress}
                classes="w-full"
                onClick={() => handleShareClick($selectedAccountStore.depositAddress)}
            >
                {localize('general.shareAddress')}
            </Button>
        </div>
    </main>
{:else}
    <div
        class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0 p-6"
        bind:clientHeight={wrapperHeight}
        bind:clientWidth={wrapperWidth}
    >
        <div class="w-full flex flex-row justify-between items-center">
            <div class="w-full flex flex-row space-x-4 items-center">
                <Text classes="text-left" type="h5">{localize('general.receiveFunds')}</Text>
                <button on:click={generateNewAddress} class:pointer-events-none={isGeneratingAddress}>
                    <Icon
                        icon="refresh"
                        classes="{isGeneratingAddress && 'animate-spin-reverse'} text-gray-500 dark:text-white"
                    />
                </button>
            </div>
            <button on:click={handleCloseClick}>
                <Icon icon="close" classes="text-gray-800 dark:text-white" />
            </button>
        </div>
        {#if $isLedgerProfile && !$hasGeneratedALedgerReceiveAddress}
            <div class="flex w-full h-full justify-center items-end">
                <Button
                    disabled={isGeneratingAddress || $isSyncing}
                    classes="w-full"
                    onClick={() => generateNewAddress()}
                >
                    {#if isGeneratingAddress}
                        <Spinner
                            busy={isGeneratingAddress}
                            message={localize('general.generatingReceiveAddress')}
                            classes="justify-center"
                        />
                    {:else}{localize('actions.generateAddress')}{/if}
                </Button>
            </div>
        {:else}
            <div class="flex flex-auto items-center justify-center mb-4">
                <QR size={qrSize} data={$selectedAccountStore.depositAddress} />
            </div>
            <div class="mb-6">
                <Text secondary smaller classes="mb-1">
                    {$activeProfile?.isDeveloperProfile
                        ? `${$activeProfile.settings.networkConfig.network.name} ${localize('general.address')}`
                        : localize('general.myAddress')}
                </Text>
                <Text type="pre">{$selectedAccountStore.depositAddress}</Text>
            </div>
            <Button
                disabled={isGeneratingAddress}
                classes="w-full"
                onClick={() => setClipboard($selectedAccountStore.depositAddress)}
            >
                {localize('general.copyAddress')}
            </Button>
        {/if}
    </div>
{/if}

<style type="text/scss">
    main {
        height: calc(97vh - env(safe-area-inset-top));
    }
</style>
