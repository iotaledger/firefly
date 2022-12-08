<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, Text, FontWeight, NftMediaContainer, Tabs, KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'
    import { buildNftOutputData, formatTokenAmountPrecise, mintNft, mintNftDetails } from '@core/wallet'
    import { activeProfile, checkActiveProfileAuth } from '@core/profile'
    import { handleError } from '@core/error/handlers/handleError'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { CURRENT_IRC27_VERSION } from '@core/nfts'
    import { BASE_TOKEN } from '@core/network'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    enum Tab {
        Transaction = 'general.transaction',
        Nft = 'general.nft',
        Metadata = 'general.metadata',
    }

    const tabs: Tab[] = [Tab.Transaction, Tab.Nft, Tab.Metadata]
    let activeTab = Tab.Transaction

    let storageDeposit = '0'
    const { standard, type, uri, name, collectionName, royalties, issuerName, description, attributes } =
        $mintNftDetails

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
        const preparedOutput = await $selectedAccount.buildNftOutput(outputData)
        storageDeposit = formatTokenAmountPrecise(
            Number(preparedOutput.amount) ?? 0,
            BASE_TOKEN[$activeProfile?.networkProtocol]
        )
    }

    async function mintAction(): Promise<void> {
        try {
            await mintNft(irc27Metadata)
            closePopup()
        } catch (err) {
            handleError(err)
        }
    }

    function handleBack(): void {
        closePopup()
        openPopup({
            type: 'mintNftForm',
            overflow: true,
        })
    }

    async function handleMint(): Promise<void> {
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
            <NftMediaContainer />
            <activity-details class="w-full h-full space-y-2 flex flex-auto flex-col flex-shrink-0">
                <Tabs bind:activeTab {tabs} />
                {#if activeTab === Tab.Transaction}
                    <KeyValueBox keyText={localize('general.storageDeposit')} valueText={storageDeposit} />
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
                        classes="whitespace-pre-wrap"
                    />
                {/if}
            </activity-details>
        </nft-details>
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={$selectedAccount.isTransferring} onClick={handleBack}>
            {localize('actions.back')}
        </Button>
        <Button
            classes="w-full"
            disabled={$selectedAccount.isTransferring}
            onClick={handleMint}
            isBusy={$selectedAccount.isTransferring}
        >
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
