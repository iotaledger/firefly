<script lang="typescript">
    import { localize } from '@core/i18n'
    import { accountRouter } from '@core/router'
    import { Button, Icon, QR, Spinner, Text } from 'shared/components'
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
</script>

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
            <Button disabled={isGeneratingAddress || $isSyncing} classes="w-full" onClick={() => generateNewAddress()}>
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
            <div class="rounded-xl bg-white p-2">
                <QR size={qrSize} data={$selectedAccountStore.depositAddress} />
            </div>
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
