<script lang="typescript">
    import { Button, Icon, QR, Spinner, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, isLedgerProfile } from 'shared/lib/profile'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { setClipboard } from 'shared/lib/utils'
    import { hasGeneratedALedgerReceiveAddress, isSyncing, selectedAccount } from 'shared/lib/wallet'

    export let isGeneratingAddress = false

    export let onGenerateAddress: (id: string) => void = () => {}

    const generateNewAddress = (): void => {
        onGenerateAddress($selectedAccount.id)
    }

    const handleBackClick = () => {
        accountRoute.set(AccountRoutes.Init)
    }
</script>

<div class="{$mobile ? 'py-10' : 'py-6'} w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0 px-6">
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
        {#if !$mobile}
            <button on:click={handleBackClick}>
                <Icon icon="close" classes="text-gray-800 dark:text-white" />
            </button>
        {/if}
    </div>
    {#if $isLedgerProfile && !$hasGeneratedALedgerReceiveAddress}
        <div class="flex w-full h-full items-center justify-center">
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
        <div class="flex flex-auto justify-center items-center mb-4">
            <QR size={$mobile ? 180 : 98} data={$selectedAccount.depositAddress} />
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
    {/if}
</div>
