<script lang="ts">
    import { localize } from '@core/i18n'
    import { getBaseToken, checkActiveProfileAuth } from '@core/profile'
    import {
        createNativeToken,
        mintTokenDetails,
        TokenStandard,
        buildFoundryOutputData,
        formatTokenAmountPrecise,
        IIrc30Metadata,
        IMintTokenDetails,
    } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { Button, KeyValueBox, Text, FontWeight, TextType } from 'shared/components'
    import { onMount } from 'svelte'
    import { selectedWallet } from '@core/wallet'
    import { handleError } from '@core/error/handlers/handleError'
    import { getClient } from '@core/wallet/actions'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit = '0'

    let metadata: IIrc30Metadata | undefined
    $: metadata = getMetadata($mintTokenDetails)
    $: isTransferring = $selectedWallet?.isTransferring

    async function prepareFoundryOutput(): Promise<void> {
        if ($mintTokenDetails && $selectedWallet && metadata) {
            const { totalSupply, circulatingSupply, accountId } = $mintTokenDetails
            const outputData = await buildFoundryOutputData(
                Number(totalSupply),
                Number(circulatingSupply),
                metadata,
                accountId
            )
            const client = await getClient()
            const preparedOutput = await client.buildFoundryOutput(outputData)
            storageDeposit = formatTokenAmountPrecise(Number(preparedOutput.amount) ?? 0, getBaseToken())
        }
    }

    let detailsList: { [key: string]: { data: string; tooltipText?: string; isCopyable?: boolean } } | undefined
    $: detailsList = getDetailsList($mintTokenDetails)

    function getDetailsList(
        details: IMintTokenDetails | undefined
    ): { [key: string]: { data: string; tooltipText?: string; isCopyable?: boolean } } | undefined {
        if (details) {
            const { name: tokenName, symbol, accountId, url, logoUrl, decimals, totalSupply } = details
            return {
                ...(accountId && {
                    account: { data: accountId, isCopyable: true },
                }),
                ...(storageDeposit && {
                    storageDeposit: { data: storageDeposit },
                }),
                ...(tokenName && {
                    tokenName: { data: tokenName },
                }),
                ...(totalSupply && {
                    totalSupply: { data: String(totalSupply) },
                }),
                ...(decimals && {
                    decimals: { data: String(decimals) },
                }),
                ...(symbol && {
                    symbol: { data: symbol },
                }),
                ...(url && {
                    url: { data: url },
                }),
                ...(logoUrl && {
                    logoUrl: { data: logoUrl },
                }),
            }
        }
    }

    function getMetadata(details: IMintTokenDetails | undefined): IIrc30Metadata | undefined {
        if (details) {
            const { name: tokenName, symbol, description, url, logoUrl, decimals } = details

            return {
                standard: TokenStandard.Irc30,
                name: tokenName,
                symbol,
                decimals: Number(decimals),
                ...(description && { description }),
                ...(url && { url }),
                ...(logoUrl && { logoUrl }),
            }
        }
    }

    async function mintAction(): Promise<void> {
        try {
            if ($mintTokenDetails && metadata) {
                await createNativeToken(
                    Number($mintTokenDetails.totalSupply),
                    Number($mintTokenDetails.circulatingSupply),
                    metadata
                )
                closePopup()
            } else {
                throw new Error()
            }
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
        openPopup({
            id: PopupId.MintNativeTokenForm,
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
            await prepareFoundryOutput()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<div class="space-y-6">
    <Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold}>
        {localize('popups.nativeToken.confirmationTitle')}
    </Text>

    <div class="space-y-2 max-h-100 scrollable-y flex-1">
        {#if detailsList && Object.entries(detailsList).length > 0}
            <details-list class="flex flex-col space-y-2">
                {#each Object.entries(detailsList) as [key, value]}
                    <KeyValueBox
                        keyText={localize(`popups.nativeToken.property.${key}`)}
                        valueText={value.data}
                        isCopyable={value.isCopyable}
                    />
                {/each}
            </details-list>
        {/if}
    </div>
    <div class="flex flex-row flex-nowrap w-full space-x-4">
        <Button outline classes="w-full" disabled={isTransferring} onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" disabled={isTransferring} onClick={onConfirmClick} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </div>
</div>
