<script lang="typescript">
    import { Button, Icon, QR, Spinner, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, isLedgerProfile } from 'shared/lib/profile'
    import { setClipboard } from 'shared/lib/utils'
    import { hasGeneratedALedgerReceiveAddress, isSyncing, selectedAccount } from 'shared/lib/wallet'

    export let isGeneratingAddress = false

    export let onGenerateAddress: (id: string) => void = () => {}

    const generateNewAddress = (): void => {
        onGenerateAddress($selectedAccount.id)
    }
</script>

<div class="w-full h-full flex flex-col justify-between">
    <div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
        {#if $isLedgerProfile && !$hasGeneratedALedgerReceiveAddress}
            <div class="flex w-full h-full items-end">
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
            <div
                class="receive-info w-full h-full flex flex-col flex-auto rounded-xl border border-solid border-gray-300 dark:border-gray-700 p-4"
            >
                <div class="w-full flex flex-row justify-between items-center mb-1">
                    <Text type="p" smaller bold>{localize('actions.receive')}</Text>
                    <button on:click={generateNewAddress} class:pointer-events-none={isGeneratingAddress}>
                        <Icon
                            icon="refresh"
                            classes="{isGeneratingAddress && 'animate-spin-reverse'} text-gray-500 dark:text-white"
                        />
                    </button>
                </div>
                <div class="flex flex-auto items-center justify-center mb-4">
                    <QR size={98} data={$selectedAccount.depositAddress} />
                </div>
                <div class="mb-6">
                    <Text secondary smaller classes="mb-1">
                        {$activeProfile?.isDeveloperProfile
                            ? `${$activeProfile.settings.networkConfig.network.name} ${localize('general.address')}`
                            : localize('general.myAddress')}
                    </Text>
                    <Text type="pre">{$selectedAccount.depositAddress}</Text>
                </div>
                <Button
                    disabled={isGeneratingAddress}
                    classes="w-full"
                    onClick={() => setClipboard($selectedAccount.depositAddress)}
                >
                    {localize('general.copyAddress')}
                </Button>
            </div>
        {/if}
    </div>
</div>

<style type="text/scss">
    .receive-info {
        max-height: 350px;
    }
</style>
