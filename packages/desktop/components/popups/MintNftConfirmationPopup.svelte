<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, Text, FontWeight, NftImageOrIconBox, Tabs, KeyValueBox, NftSize } from 'shared/components'
    import { localize } from '@core/i18n'
    import { getClient } from '@core/profile-manager'
    import { selectedAccount } from '@core/account'
    import { buildNftOutputData, formatTokenAmountPrecise, mintNft, mintNftDetails } from '@core/wallet'
    import { getBaseToken, checkActiveProfileAuth } from '@core/profile'
    import { handleError } from '@core/error/handlers/handleError'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { CURRENT_IRC27_VERSION } from '@core/nfts'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    enum Tab {
        Transaction = 'general.transaction',
        Nft = 'general.nft',
        Metadata = 'general.metadata',
    }

    const tabs: Tab[] = [Tab.Transaction, Tab.Nft, Tab.Metadata]
    let activeTab = Tab.Transaction

    let storageDeposit: number = 0
    let totalStorageDeposit: number = 0
    const { standard, type, uri, name, collectionName, royalties, issuerName, description, attributes, quantity } =
        $mintNftDetails || {}

    $: irc27Metadata = {
        standard,
        version: CURRENT_IRC27_VERSION,
        name,
        type,
        uri,
        ...(collectionName && { collectionName }),
        ...(royalties && { royalties }),
        ...(issuerName && { issuerName }),
        ...(description && { description }),
        ...(attributes && { attributes }),
    }

    let nftTabDetails: { [key in string]: string }
    $: {
        nftTabDetails = {
            name,
            ...(description && { description }),
            uri,
            ...(issuerName && { issuerName }),
            ...(collectionName && { collectionName }),
        }
    }

    async function prepareNftOutput(): Promise<void> {
        const outputData = buildNftOutputData(irc27Metadata, $selectedAccount.depositAddress)
        const client = await getClient()
        const preparedOutput = await client.buildNftOutput(outputData)
        storageDeposit = Number(preparedOutput.amount) ?? 0
        totalStorageDeposit = storageDeposit * quantity
    }

    async function mintAction(): Promise<void> {
        try {
            await mintNft(irc27Metadata, Number(quantity))
            closePopup()
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.MintNftForm,
            overflow: true,
        })
    }

    async function onConfirmClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(mintAction, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareNftOutput()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="space-y-6">
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.mintNftForm.title')}
    </Text>
    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        <nft-details class="flex flex-col justify-center items-center space-y-4">
            <NftImageOrIconBox size={NftSize.Large} />
            <activity-details class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
                <Tabs bind:activeTab {tabs} />
                {#if activeTab === Tab.Transaction}
                    {#if quantity > 1}
                        <KeyValueBox keyText={localize('general.quantity')} valueText={quantity} />
                        <KeyValueBox
                            keyText={localize('general.storageDepositPerNft')}
                            valueText={formatTokenAmountPrecise(storageDeposit, getBaseToken())}
                        />
                        <KeyValueBox
                            keyText={localize('general.totalStorageDeposit')}
                            valueText={formatTokenAmountPrecise(totalStorageDeposit, getBaseToken())}
                        />
                    {:else}
                        <KeyValueBox
                            keyText={localize('general.storageDeposit')}
                            valueText={formatTokenAmountPrecise(storageDeposit, getBaseToken())}
                        />
                    {/if}
                    <KeyValueBox
                        keyText={localize('general.immutableIssuer')}
                        valueText={$selectedAccount.depositAddress}
                    />
                {:else if activeTab === Tab.Nft}
                    {#each Object.entries(nftTabDetails) as [key, value]}
                        <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} />
                    {/each}
                {:else if activeTab === Tab.Metadata}
                    <KeyValueBox
                        keyText={localize('general.metadata')}
                        valueText={JSON.stringify(irc27Metadata, null, '\t')}
                        isPreText
                    />
                {/if}
            </activity-details>
        </nft-details>
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={$selectedAccount.isTransferring} onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button
            classes="w-full"
            disabled={$selectedAccount.isTransferring}
            onClick={onConfirmClick}
            isBusy={$selectedAccount.isTransferring}
        >
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
